function calculateUtilizationRate(kilometrage) {
    // Nombre d'heures d'utilisation typiques pour chaque tranche de kilométrage
    const heuresParTranche = {
        "0-10000": 500,
        "10001-20000": 450,
        "20001-30000": 400,
        "30001-40000": 350,
        "40001-50000": 300,
        "50001-60000": 250,
        "60001-70000": 200,
        "70001-80000": 150,
        "80001-90000": 100,
        "90001+": 50
    };

    // Trouver la tranche de kilométrage correspondante
    let trancheKilometrage;
    for (let tranche in heuresParTranche) {
        const [min, max] = tranche.split("-").map(Number);
        if (kilometrage >= min && (max === undefined || kilometrage <= max)) {
            trancheKilometrage = tranche;
            break;
        }
    }

    // Si le kilométrage est supérieur à la plus grande tranche, utilisez le dernier taux d'utilisation
    if (!trancheKilometrage) {
        trancheKilometrage = "90001+";
    }

    // Calculer le taux d'utilisation en heures
    const heuresUtilisation = heuresParTranche[trancheKilometrage];

    // Utilisation rate = heures d'utilisation / 8760 (heures en une année)
    const utilizationRate = (heuresUtilisation / 8760) * 100;

    return utilizationRate.toFixed(2); // Renvoyer le taux d'utilisation arrondi à 2 décimales
}

function createBarChart(ctx, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour créer le graphique de type polarArea
function createPolarAreaChart(ctx, data) {
    return new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['vehicle1', 'vehicle2'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour créer le graphique de type line
function createLineChart(ctx, data1, data2) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'vehicle 1',
                data: data1,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'vehicle 2',
                data: data2,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function estimateFuelConsumption(kilometrage, efficaciteEnergetique) {
    // Estimer la quantité de carburant consommée en fonction du kilométrage et de l'efficacité énergétique moyenne
    const quantiteCarburant = (kilometrage / 100) * efficaciteEnergetique;
    return quantiteCarburant.toFixed(2); // Renvoyer la quantité de carburant estimée arrondie à 2 décimales
}
function calculateFuelConsumption(quantiteCarburant, distanceParcourue) {
    // Calculer la consommation moyenne de carburant
    const consommationMoyenne = quantiteCarburant / distanceParcourue;
    return consommationMoyenne.toFixed(2); // Renvoyer la consommation moyenne arrondie à 2 décimales
}

// Connexion au serveur WebSocket
const socket = new WebSocket('ws://localhost:1880/static');

// Lorsqu'un message est reçu via WebSocket
socket.addEventListener('message', (event) => { 
    const message = event.data;
    console.log(message);
    const receivedValue = parseInt(message);
    const tauxUtilisation = calculateUtilizationRate(receivedValue);
    const quantiteCarburantEstimee = estimateFuelConsumption(receivedValue, 8);
    const consommationMoyenne = calculateFuelConsumption(quantiteCarburantEstimee, receivedValue);
    
    updateChart(myChart1, [1200, 19000, receivedValue, 0, 0, 0, 0, 0, 0, 0, 0, 0]); 
    myChart3.data.datasets[0].data[0] = consommationMoyenne;
    myChart4.data.datasets[0].data[2] = tauxUtilisation;
    myChart4.update();
    myChart3.update();
});
function updateChart(chart, newData) {
    chart.data.datasets[0].data = newData;
    chart.update();
}
// Créer le premier graphique de type bar
var ctx1 = document.getElementById('myChart').getContext('2d');
var myChart1 = createBarChart(ctx1, [12000, 19000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

// Créer le deuxième graphique de type bar
var ctx2 = document.getElementById('myChart2').getContext('2d');
var myChart2 = createBarChart(ctx2, [7, 15, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

// Créer le troisième graphique de type polarArea
var ctx3 = document.getElementById('myChart3').getContext('2d');
ctx3.canvas.width = 50; // Définir la largeur souhaitée
ctx3.canvas.height = 50; // Définir la hauteur souhaitée
var myChart3 = createPolarAreaChart(ctx3, [0.5, 0.5]);

// Créer le quatrième graphique de type line
var ctx4 = document.getElementById('myChart4').getContext('2d');
var myChart4 = createLineChart(ctx4, [90, 75, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0], [25, 30, 19, 18, 16, 9, 13, 7, 22, 27, 12, 10]);
