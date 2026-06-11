package com.proyectouno.turismoweb.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = "${cors.allowed-origins}")
@RequiredArgsConstructor
public class QRController {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final TownService townService;

    @GetMapping(value = "/{slug}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQR(@PathVariable String slug) {
        Town town = townService.getTownBySlug(slug).orElse(null);
        if (town == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        try {
            // Aseguramos que no haya doble diagonal si frontendUrl termina en /
            String baseUrl = frontendUrl.endsWith("/") 
                ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
            String url = baseUrl + "/p/" + slug;

            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(url, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"qr-" + slug + ".png\"")
                    .body(out.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
