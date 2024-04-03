function createLineChart(ctx, data1) {
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

function updateChartWithLoss(chart, newData, lossAmount) {
    // Mettre à jour les données du graphique
    chart.data.datasets[0].data = newData;
    
    // Mettre à jour le montant de perte
    chart.data.datasets[1].data = [lossAmount];
    
    // Mettre à jour le graphique
    chart.update();
}
// Créer le graphique initial
var ctx4 = document.getElementById('myChart4').getContext('2d');
var myChart4 = createLineChart(ctx4, [900, 750, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
let fuelLoss=0;
// Fonction pour mettre à jour le graphique avec les données de perte de carburant accumulées
function updateChart(chart, newData) {
    chart.data.datasets[0].data = newData;
    chart.update();
}
// Fonction pour extraire le niveau de carburant à partir du message
function extractFuelLevel(message) {
    // Utilisez une expression régulière pour extraire le nombre de la chaîne
    const match = message.match(/FL\s*:\s*(\d+)/);
    // Si une correspondance est trouvée, retournez le nombre, sinon retournez null
    return match ? parseInt(match[1]) : null;
}
function updateFuelGauge(fuelLevel) {
    const fuelMeter = document.getElementById('fuelMeter');
    fuelMeter.value = fuelLevel;
    document.getElementById('fuelLevelValue').textContent = `Fuel Level: ${fuelLevel}`;
}
// Fonction pour gérer les messages WebSocket
const socket = new WebSocket('ws://localhost:1880/cost');
socket.addEventListener('message', (event) => { 
    const message = event.data;
    
    const fuelLevel = extractFuelLevel(message);
    console.log(fuelLevel);
    updateFuelGauge(fuelLevel);
    // Vérifier si le niveau de carburant est inférieur à 15
    if (fuelLevel < 15) {
        // Demander à l'utilisateur le montant de perte pour ce mois
        var lossAmount = prompt("Fuel level is below 15. Please enter the loss amount for this month:", "");
        
        // Convertir le montant de perte en nombre
        lossAmount = parseInt(lossAmount);
        
        fuelLoss += lossAmount;
        
        myChart4.data.datasets[0].data[2] = fuelLoss;
        myChart4.update();
    }
});

