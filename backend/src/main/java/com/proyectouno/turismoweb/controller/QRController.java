package com.proyectouno.turismoweb.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.repository.TownRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class QRController {

    @Value("${frontend.url}")
    private String frontendUrl;

    private final TownRepository townRepository;

    public QRController(TownRepository townRepository) {
        this.townRepository = townRepository;
    }

    @GetMapping(value = "/{slug}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQR(@PathVariable String slug) {
        Town town = townRepository.findBySlug(slug).orElse(null);
        if (town == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        try {
            String url = frontendUrl + "/p/" + slug;
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
