<?php
//On dit que c'est du JSON
header("Content-Type: application/json");

try {
    
    $pdo = new PDO(
        "mysql:host=localhost;dbname=GAME;charset=utf8",
        "root",
        "",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    
    $json = file_get_contents('php://input');//Récuper le body de ma requête
    $data = json_decode($json, true);//Convertie le body en tableau grace a true sinon c un objet

    $pseudo = $data['class_pseudo'] ?? '';
    $score = $data['class_score'] ?? '';
    $accurate = $data['class_precision_score'] ?? '';
    $date = $data['class_date'] ?? '';
    
    $sql = "INSERT INTO classement (class_pseudo, class_score, class_precision_score, class_date) 
                VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$pseudo, $score, $accurate, $date]); 

    echo json_encode([
        "success" => true,
        "message" => "Post ajouté avec succès"
    ]);


} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur : " . $e->getMessage()
    ]);
}