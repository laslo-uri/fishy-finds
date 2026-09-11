package com.fishyfinds.isa.requirements;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Contract: Vue uses HTML5 history mode; component links must not use #/ hashes.
 */
class HistoryModeContractTest {

    private Path staticRoot() {
        Path fromCwd = Paths.get("src", "main", "resources", "static");
        if (Files.isDirectory(fromCwd)) {
            return fromCwd;
        }
        Path alt = Paths.get("..", "src", "main", "resources", "static").normalize();
        assertTrue(Files.isDirectory(alt), "static resources not found");
        return alt;
    }

    @Test
    @DisplayName("app.js uses VueRouter history mode (not hash)")
    void appJsHistoryMode() throws Exception {
        String appJs = Files.readString(staticRoot().resolve("app.js"), StandardCharsets.UTF_8);
        assertTrue(appJs.contains("mode: 'history'") || appJs.contains("mode: \"history\""),
                "Router must use history mode");
        assertFalse(appJs.contains("mode: 'hash'") || appJs.contains("mode: \"hash\""),
                "Router must not use hash mode");
    }

    @Test
    @DisplayName("Vue components have no href=\"#/…\" hash links")
    void noHashHrefInComponents() throws Exception {
        Path components = staticRoot().resolve("components");
        assertTrue(Files.isDirectory(components));
        try (Stream<Path> files = Files.walk(components)) {
            files.filter(p -> p.toString().endsWith(".js")).forEach(p -> {
                try {
                    String src = Files.readString(p, StandardCharsets.UTF_8);
                    assertFalse(src.contains("href=\"#/") || src.contains("href='#/"),
                            "Hash href found in " + p.getFileName());
                } catch (Exception e) {
                    fail(e);
                }
            });
        }
    }

    @Test
    @DisplayName("index.html migrates legacy #/ URLs to clean paths")
    void indexMigratesHashUrls() throws Exception {
        String html = Files.readString(staticRoot().resolve("index.html"), StandardCharsets.UTF_8);
        assertTrue(html.contains("<base href=\"/\">") || html.contains("<base href='/'>"));
        assertTrue(html.contains("#/") && html.contains("replaceState"),
                "Expected hash→path migration script");
    }
}
