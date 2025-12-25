<?php
header("Content-Type: application/json");

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=GAME;charset=utf8",
        "root",
        "",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
    );

    // On récupère tous les posts, les plus récents en premier
    $stmt = $pdo->query(
        "SELECT * FROM classement ORDER BY class_score DESC LIMIT 50",
    );
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "table" => true,
        "lead" => $posts,
    ]);
} catch (Exception $e) {
    echo json_encode([
        "table" => false,
        "message" => "bdd non trouver",
    ]);
}
