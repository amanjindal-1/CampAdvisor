package com.trailnest.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TrailnestApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrailnestApiApplication.class, args);
	}

}
