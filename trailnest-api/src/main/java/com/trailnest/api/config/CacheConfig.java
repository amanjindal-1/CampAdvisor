package com.trailnest.api.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Dev:  spring.cache.type=simple → in-memory ConcurrentHashMap, no Redis needed
    // Prod: spring.cache.type=redis  → Redis CacheManager auto-configured
}
