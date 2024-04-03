<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "test_1234"; // Modifier selon vos informations
$database = "fleet";

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $database);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connexion échouée: " . $conn->connect_error);
}

// Vérifier si des données ont été soumises via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données du formulaire
    $BC = $_POST['BC'];
    $TP = $_POST['TP'];
    $AS = $_POST['AS'];

    // Préparer la requête SQL d'insertion
    $insert_sql = "INSERT INTO vehicules (BC, TP, airbag_status) VALUES (?, ?, ?)";

    // Préparer la déclaration
    $stmt = $conn->prepare($insert_sql);

    // Vérifier la préparation de la déclaration
    if ($stmt === false) {
        echo "Erreur lors de la préparation de la requête: " . $conn->error;
    } else {
        // Lier les paramètres et exécuter la requête
        $stmt->bind_param("ddd", $BC, $TP, $AS);
        if ($stmt->execute()) {
            echo "";
        } else {
            echo ":" . $stmt->error;
        }
    }

    // Fermer la déclaration
    $stmt->close();
}

// Exécuter la requête SQL SELECT pour récupérer les données et la date d'insertion
$sql = "SELECT NOW() AS date_insertion, BC, TP, airbag_status FROM vehicules";
$result = $conn->query($sql);

// Vérifier si des résultats sont retournés
if ($result->num_rows > 0) {
    // Afficher les données dans un tableau
    echo "<table>";
    echo "<tr><th>Date d'insertion</th><th>Battery Capacity</th><th>Tire Pressure</th><th>airbag status</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["date_insertion"] . "</td><td>" . $row["BC"] . "</td><td>" . $row["TP"] . "</td><td>" . $row["airbag_status"] . "</td></tr>";
    }
    echo "</table>";
} else {
    echo "Aucune donnée trouvée";
}

// Fermer la connexion à la base de données
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body{
            background-image: url('Design\ sans\ titre\ \(1\).png');
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }

        /* Style pour les titres de section */
        h2 {
            margin-bottom: 15px;
        }

        /* Style pour les div de la classe "container" */
        .container {
            margin-top: 20px;
        }

        /* Style pour les div de la classe "box" */
        .box {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 20px;
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            let lastTP = null;
            let lastBC = null;
            let lastAS = null;
            const socket = new WebSocket('ws://localhost:1880/jplearning');
            socket.addEventListener('message', (event) => { 
                const message = event.data;
                function extraireValeurs(message) {
                    const regex = /(?:TP|BC|AS)\s*:\s*([\d.]+)/g;
                    const valeurs = {};
                    let match;
                    while ((match = regex.exec(message)) !== null) {
                        const cle = match[0].split(':')[0].trim();
                        const valeur = parseFloat(match[1]);
                        if (!valeurs[cle]) {
                            valeurs[cle] = [valeur];
                        } else {
                            valeurs[cle].push(valeur);
                        }
                    }
                    return valeurs;
                }
        
                // Extraction des valeurs de TP, BC et AS
                const valeurs = extraireValeurs(message);
        
                // Manipulation des valeurs extraites comme souhaité (par exemple, affectation à d'autres variables)
                lastTP = valeurs["TP"] ? valeurs["TP"][0] : lastTP;
                lastBC = valeurs["BC"] ? valeurs["BC"][0] : lastBC;
                lastAS = valeurs["AS"] ? valeurs["AS"][0] : lastAS;
        
                // Affichage des valeurs dans les éléments HTML
                document.getElementById('TP').value = lastTP;
                document.getElementById('BC').value = lastBC;
                document.getElementById('AS').value = lastAS;

                // Vérifier si tous les champs sont remplis
                const BCValue = document.getElementById('BC').value;
                const TPValue = document.getElementById('TP').value;
                const ASValue = document.getElementById('AS').value;
                if (BCValue && TPValue && ASValue) {
                    // Lancer le clic sur le bouton d'enregistrement
                    document.getElementById('enregistrerBtn').click();
                }
            });

            // Définir une minuterie pour cliquer sur le bouton d'enregistrement toutes les 5 minutes
            setInterval(function() {
                // Vérifier si tous les champs sont remplis
                const BCValue = document.getElementById('BC').value;
                const TPValue = document.getElementById('TP').value;
                const ASValue = document.getElementById('AS').value;
                if (BCValue && TPValue && ASValue) {
                    // Lancer le clic sur le bouton d'enregistrement
                    document.getElementById('enregistrerBtn').click();
                }
            }, 5 * 60 * 1000); // 5 minutes en millisecondes
        });
    </script>
    <title>HISTORIC</title>
</head>
<body>
    <!-- Formulaire de saisie des données -->
    <form method="post">
        <label style="display: none;" for="BC">BC :</label>
        <input type="text" style="display: none;" id="BC" name="BC"  required><br><br>
        <label style="display: none;" for="TP">TP :</label>
        <input type="text" id="TP" style="display: none;" name="TP" required><br><br>
        <label style="display: none;" for="AS">AS :</label>
        <input type="text" style="display: none;" id="AS" name="AS" required><br><br>
        <!-- Bouton d'enregistrement -->
        <input type="submit" id="enregistrerBtn" value="Enregistrer" style="display: none;">
    </form>
   
</body>
</html>
