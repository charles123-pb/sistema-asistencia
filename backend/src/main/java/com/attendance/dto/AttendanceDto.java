package com.attendance.dto;

import lombok.Data;
import java.util.Map;

public class AttendanceDto {

    @Data
    public static class RecordRequest {
        private String value; // 'p', 'a', 't', 'j'
    }

    @Data
    public static class BatchRequest {
        // Map<studentId, value>
        private Map<Long, String> attendance;
    }
}
