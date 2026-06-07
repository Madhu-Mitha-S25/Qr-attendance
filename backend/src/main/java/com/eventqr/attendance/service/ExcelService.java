package com.eventqr.attendance.service;

import com.eventqr.attendance.entity.Attendance;
import com.eventqr.attendance.entity.Event;
import com.eventqr.attendance.entity.Participant;
import com.eventqr.attendance.exception.CustomExceptions;
import com.eventqr.attendance.repository.ParticipantRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExcelService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Transactional
    public void parseParticipantsExcel(MultipartFile file, Event event) {
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new CustomExceptions.ExcelProcessingException("Excel sheet is empty!");
            }

            int nameIdx = -1;
            int emailIdx = -1;
            int deptIdx = -1;

            for (Cell cell : headerRow) {
                if (cell.getCellType() == CellType.STRING) {
                    String value = cell.getStringCellValue().trim().toLowerCase();
                    if (value.contains("name")) {
                        nameIdx = cell.getColumnIndex();
                    } else if (value.contains("email")) {
                        emailIdx = cell.getColumnIndex();
                    } else if (value.contains("department") || value.contains("dept")) {
                        deptIdx = cell.getColumnIndex();
                    }
                }
            }

            if (nameIdx == -1 || emailIdx == -1 || deptIdx == -1) {
                throw new CustomExceptions.ExcelProcessingException(
                        "Required columns (Name, Email, Department) not found in header row!");
            }

            List<Participant> participants = new ArrayList<>();
            Set<String> uniqueEmails = new HashSet<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Cell nameCell = row.getCell(nameIdx);
                Cell emailCell = row.getCell(emailIdx);
                Cell deptCell = row.getCell(deptIdx);

                if (nameCell == null || emailCell == null || deptCell == null) continue;

                String name = getCellValueAsString(nameCell);
                String email = getCellValueAsString(emailCell);
                String dept = getCellValueAsString(deptCell);

                if (name.isEmpty() || email.isEmpty() || dept.isEmpty()) continue;

                email = email.toLowerCase();
                if (uniqueEmails.contains(email)) continue; // skip duplicates in Excel file

                uniqueEmails.add(email);

                participants.add(Participant.builder()
                        .event(event)
                        .name(name)
                        .email(email)
                        .department(dept)
                        .build());
            }

            if (participants.isEmpty()) {
                throw new CustomExceptions.ExcelProcessingException("No valid participant rows found in Excel!");
            }

            participantRepository.saveAll(participants);

        } catch (CustomExceptions.ExcelProcessingException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomExceptions.ExcelProcessingException("Error parsing Excel file: " + e.getMessage());
        }
    }

    public byte[] exportAttendanceReport(Event event, List<Participant> participants, List<Attendance> attendances) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Attendance Report");

            // Info rows
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("EVENT ATTENDANCE REPORT: " + event.getEventName());
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);

            Row detailsRow = sheet.createRow(1);
            detailsRow.createCell(0).setCellValue("Mode: " + event.getAttendanceMode());
            detailsRow.createCell(2).setCellValue("Start: " + event.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            detailsRow.createCell(4).setCellValue("End: " + event.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

            // Create Headers
            Row headerRow = sheet.createRow(3);
            String[] columns = {"S.No", "Name", "Email", "Department", "Attendance Time", "Status"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Create Styles for status
            CellStyle presentStyle = workbook.createCellStyle();
            Font presentFont = workbook.createFont();
            presentFont.setColor(IndexedColors.GREEN.getIndex());
            presentFont.setBold(true);
            presentStyle.setFont(presentFont);

            CellStyle absentStyle = workbook.createCellStyle();
            Font absentFont = workbook.createFont();
            absentFont.setColor(IndexedColors.RED.getIndex());
            absentFont.setBold(true);
            absentStyle.setFont(absentFont);

            Map<Long, Attendance> attendanceMap = attendances.stream()
                    .collect(Collectors.toMap(a -> a.getParticipant().getId(), a -> a, (a1, a2) -> a1));

            int rowIdx = 4;
            int sNo = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (Participant participant : participants) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(sNo++);
                row.createCell(1).setCellValue(participant.getName());
                row.createCell(2).setCellValue(participant.getEmail());
                row.createCell(3).setCellValue(participant.getDepartment());

                Cell timeCell = row.createCell(4);
                Cell statusCell = row.createCell(5);

                Attendance att = attendanceMap.get(participant.getId());
                if (att != null) {
                    timeCell.setCellValue(att.getAttendanceTime().format(formatter));
                    statusCell.setCellValue("Present");
                    statusCell.setCellStyle(presentStyle);
                } else {
                    timeCell.setCellValue("-");
                    statusCell.setCellValue("Absent");
                    statusCell.setCellStyle(absentStyle);
                }
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(bos);
            return bos.toByteArray();

        } catch (Exception e) {
            throw new CustomExceptions.ExcelProcessingException("Error exporting Excel file: " + e.getMessage());
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    // convert double code value to string cleanly
                    double val = cell.getNumericCellValue();
                    if (val == (long) val) {
                        return String.format("%d", (long) val);
                    } else {
                        return String.format("%s", val);
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }
}
