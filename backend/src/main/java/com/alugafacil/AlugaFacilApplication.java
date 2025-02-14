package com.alugafacil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AlugaFacilApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlugaFacilApplication.class, args);
    }
}
