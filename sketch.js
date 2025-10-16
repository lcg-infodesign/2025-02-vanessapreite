let table;
let flowers = []; // Array per salvare le informazioni
                  // di ogni fiore
                  // (posizione, dimensione, colore, rotazione, velocità).

function preload() {
  table = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  let outerPadding = 20; //spazio tra il bordo della finestra e la griglia di fiori
  let padding = 10; //distanza tra i fiori all’interno della griglia.
  let itemSize = 100; //dimensione massima di un fiore nella griglia
                      // Verrà mappata dai dati.

  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding)); //calcola quante colonne di fiori 
                                                                            // entrano orizzontalmente nella finestra
  let rows = ceil(table.getRowCount() / cols); //calcola quante righe servono per tutti i dati.
  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding; //altezza totale del canvas in base al numero di righe e padding.

  createCanvas(windowWidth, totalHeight);
  angleMode(DEGREES); //Le rotazioni saranno in gradi
  noStroke();
  background('#8CB677');

  //Variabili per tenere traccia della posizione corrente nella griglia (colonna e riga)
  let colCount = 0;
  let rowCount = 0;

  //Precalcolo min/max per le tre colonne
  //Recupera tutti i valori delle colonne del CSV e li converte in numeri.
  //Questo serve per mappare i valori in intervalli utilizzabili (dimensione, colore, rotazione)
  let allValues0 = table.getColumn("column0").map(Number);
  let allValues1 = table.getColumn("column1").map(Number);
  let allValues2 = table.getColumn("column2").map(Number);

  //Trova il valore minimo e massimo di ciascuna colonna per poter normalizzare i dati (map).
  let min0 = min(allValues0);
  let max0 = max(allValues0);
  let min1 = min(allValues1);
  let max1 = max(allValues1);
  let min2 = min(allValues2);
  let max2 = max(allValues2);

  //Ciclo su ogni riga del CSV.
  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    let data = table.getRow(rowNumber).obj;

    let sizeValue = map(Number(data["column0"]), min0, max0, 10, itemSize); //Dimensione del fiore, mappata dai valori della colonna 0.
    let colorValue = map(Number(data["column1"]), min1, max1, 0, 1); //Valore normalizzato tra 0 e 1 per generare il gradiente.
    let rotationValue = map(Number(data["column2"]), min2, max2, 0, 360); //Rotazione iniziale del fiore in gradi
    let rotationSpeed = map(Number(data["column2"]), min2, max2, 0.5, 5); // Velocità rotazione

    let flowerColor = lerpColor(color('#F88B8E'), color('#F4D808'), colorValue); //crea un gradiente basandosi su colorValue.
                                                                                //Così i fiori cambiano colore in base ai dati.

    let xPos = outerPadding + colCount * (itemSize + padding) + itemSize / 2; //Calcola la posizione del fiore nella griglia.
    let yPos = outerPadding + rowCount * (itemSize + padding) + itemSize / 2; // + itemSize / 2 serve per centrare il fiore.

    //Aggiunge un oggetto al array flowers contenente tutte le informazioni
    // necessarie per disegnare e animare il fiore.
    flowers.push({
      x: xPos,
      y: yPos,
      size: sizeValue,
      color: flowerColor,
      baseRotation: rotationValue,
      rotation: rotationValue,
      speed: rotationSpeed
    });

    //Aggiorna la posizione nella griglia: passa alla colonna successiva.
    //Se raggiunge la fine della riga, ricomincia da 0 e passa alla riga successiva.
    colCount++; 
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

//Viene eseguito continuamente, permette di aggiornare la scena.
function draw() {
  background('#8CB677');

  //Ciclo su tutti i fiori.
  for (let f of flowers) {
    // Controllo hover del mouse
    if (dist(mouseX, mouseY, f.x, f.y) < f.size / 2) { //calcola la distanza tra il mouse e il fiore.
      f.rotation = (f.rotation + f.speed) % 360; // Se il mouse è sopra il fiore
} else {                                         // aumenta la rotazione in base a f.speed.
      f.rotation = f.baseRotation;               // altrimenti, il fiore mantiene la rotazione base.
    }

    push();
    translate(f.x, f.y); //sposta il punto di origine al centro del fiore
    rotate(f.rotation); //ruota il fiore secondo il valore calcolato
    drawFlower(f.size, f.color); //disegna il fiore
    pop();
  }
}

//Disegno del fiore
function drawFlower(size, col) {
  fill(col);
  let petals = 15;
  let petalLength = size / 1.5;
  for (let i = 0; i < petals; i++) {
    ellipse(0, size / 4, petalLength / 2, size);
    rotate(360 / petals);
  }
  fill('#FDE396');
  ellipse(0, 0, size / 2);
}
