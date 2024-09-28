var puzzles = new Array (
  "123745698459681732678392145269584371513267948784913526937412856826375194451869237",
  "126895374437621985958473126457983612193246578862517394269548731314769852785231649",
  "142685973936217458857394612329451867174862593568973241298534716745621389136789425",
  "158469372362587914794312658637215984259648173841973526726841593435796821189235467",
  "269548731314769852785231649126895374437621985958473126457983612193246578862517394",
  "362175948845963217179248635713296854458731629962584713439527681576184392821396457",
  "386751942574928361291364875614837529793245186528619743478293165659817432132456987",
  "418957632297643581563812794286571394354928716179436285723845169865139472941627358",
  "452371986618429573379865241734629815162845397598713624293148567754236981186957432",
  "531428679628579143749163825986217345214835967537496281792854163381796452654312978",
  "753896412196274538482153679385624971421759683967318245248567139365912847791834526",
  "872351946139264758654987321269587134843612975175439268418725693526391487793846512",
  "921437568583629174674158392283746195765912438419835267674319852251847396983526741",
  "954126783836759124172834956295431678371568492648297315849567312215983647763421589");

var niveaux =
{
  1 : 17, /*faible*/
  2 : 15, /*moyen*/
  3 : 13, /*difficile*/
};

var grille, masque, chiffres, choixCase = null, grilleUser = new Array(81);

function toggleNiveauDropdown() {
  const dropdown = document.getElementById("niveau-dropdown");
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
      dropdown.style.display = "block";
  } else {
      dropdown.style.display = "none";
  }
}

function afficherMessage(message) {
  var messageContainer = document.getElementById("message-text");
  messageContainer.innerText = message;

  var messageOverlay = document.getElementById("message-overlay");
  messageOverlay.style.display = "flex"; // Pour afficher le message

  setTimeout(function () {
    messageOverlay.style.display = "none"; // Pour masquer le message
  }, 5000);
}

function changeNiveau(niveau) {
  initGrille(niveau, true, true);
}

function aleatoire(min, maxi) {
  return (parseInt(Math.random() * 1000) % (maxi - min + 1) + min);
}

function isChiffre(nbre) {
  return (nbre != null && nbre > 0 && nbre <= 9);
}

function creerGrille3x3(grille, chiffres, masque, id, sub) {
  var htm = "<table cellspacing=0 >";
  var x, y;
  for (y = 0; y < 3; y++) {
    htm += "<tr>";
    for (x = 0; x < 3; x++) {
      index = y * 3 + x;
      if (sub) {
        htm += "<td class='tabloExterieur' >";
        htm += creerGrille3x3(grille, chiffres, masque, index, false); /*recursif pour afficher les sous tableaux*/
        htm += "</td>";
      } else { /*test binaire sur le masque*/
        if (masque[id * 9 + index] == true) {
          htm += "<td class='tabloInterieur'  ><b>" + chiffres[parseInt(grille.charAt(id * 9 + index))] + "</b></td>";
          grilleUser[id * 9 + index] = chiffres[parseInt(grille.charAt(id * 9 + index))];
        } else {
          htm += "<td class=\"tabloInterieur\" id='c_" + (id * 9 + index) + "' onmouseover=\"choix(this,0);\" onmouseout=\"choix(this,1);\" onclick=\"choix(this,2);\">";
          htm += isChiffre(grilleUser[id * 9 + index]) ? grilleUser[id * 9 + index] : "&nbsp;";
          htm += "</td>";
        }
      }
    }
    htm += "</tr>\n";
  }
  htm += "</table>";
  return htm;
}

function choix(source, code) {
  if (code == 0) {
    source.style.background = (source == choixCase) ? '#c0ffc0' : 'yellow';
  } else if (code == 1) {
    source.style.background = (source == choixCase) ? '#c0ffc0' : '';
  } else {
    if (choixCase != null) {
      choixCase.style.background = '';
    }
    choixCase = source;
    choix(source, 0);
    verifierAutomatiquement();
  }
}

function uniqueChiffre(list) {
  var nbr = aleatoire(1, 9);
  for (var a = 0; a < list.length; a++) {
    if (list[a] == nbr) {
      nbr = aleatoire(1, 9);
      a = 0;
    }
  }
  return nbr;
}

function chiffreDesordre() {
  liste = new Array("0");
  for (j = 0; j < 9; j++) {
    nvx_chiffre = uniqueChiffre(liste);
    liste.push(nvx_chiffre);
  }
  return liste;
}

function getMasque(nbmax) {
  var list = new Array(81);
  for (i = 0; i < nbmax; i++) {
    x = aleatoire(0, 40);
    while (list[x] == true) {
      x = aleatoire(0, 40);
    }
    list[x] = true;
  }
  for (i = 0; i < 40; i++) {
    if (list[39 - i] == true) list[41 + i] = true;
  }
  return list;
}

function creerGrille(niveau, nvx) {
  if (nvx) {
    grilleUser = new Array(81);
    grille = puzzles[aleatoire(0, 13)];
    nbChiffre = niveaux[parseInt(niveau)];
    masque = getMasque(nbChiffre);
    chiffres = chiffreDesordre();
    choixCase = null;
  }
  html = creerGrille3x3(grille, chiffres, masque, 0, true);
  document.getElementById("grille").innerHTML = html;
  verifierAutomatiquement(); // Vérifie automatiquement après avoir créé la grille
}

function initGrille(niveau, code, msg) {
  if (!msg || confirm("Êtes-vous sûr de vouloir réinitialiser la grille ?")) {
    grilleUser.fill(undefined);
    creerGrille(niveau, code);
    if (choixCase) {
      choixCase.style.background = "";
      choixCase = null;
    }
    verifierAutomatiquement(); // Vérifie automatiquement après avoir initialisé la grille
  }
}

function toucher(e) {
  var key = window.event ? e.keyCode : e.which;
  supp = (key == 32 || key == 46 || key == 96 || key == 8 || key == 48);
  key -= (key < 96) ? 48 : 96;

  if (key >= 1 && key <= 9 || supp) {
    if (choixCase == null) {
      alert("Vous devez sélectionner une case pour taper un chiffre");
    } else {
      choixCase.innerHTML = supp ? "&nbsp;" : key;
      grilleUser[parseInt(choixCase.id.split("_")[1])] = supp ? "" : key;
    }
  }
}

function verif(code) {
  for (i = 0; i < 81; i++) {
    var cell = document.getElementById("c_" + i);
    if (isChiffre(grilleUser[i]) && masque[i] !== true) {
      if (code && parseInt(chiffres[parseInt(grille.charAt(i))]) !== grilleUser[i]) {
        cell.style.color = "red";
        cell.style.backgroundColor = "rgba(255, 165, 0, 0.3)"; // Orange/jaune pastel
        cell.style.fontWeight = "bold";
      } else {
        cell.style.color = "black";
        cell.style.backgroundColor = "";
        cell.style.fontWeight = "normal";
      }
    }
  }
}

function reponse(code) {
  for (i = 0; i < 81; i++) {
    var cell = document.getElementById("c_" + i);
    if (masque[i] !== true) {
      if (code && !isChiffre(grilleUser[i])) {
        cell.innerHTML = chiffres[parseInt(grille.charAt(i))];
        cell.style.fontWeight = "normal";
        cell.style.color = "black";
        cell.style.backgroundColor = "";
      } else {
        cell.innerHTML = isChiffre(grilleUser[i]) ? grilleUser[i] : "&nbsp;";
        if (masque[i] === true) {
          cell.style.fontWeight = "normal";
          cell.style.color = "black";
          cell.style.backgroundColor = "";
        }
      }
    }
  }
  verif(code);
}

function verifierAutomatiquement() {
  // Vérifie si toutes les cases sont remplies
  if (grilleUser.every(isChiffre)) {
    if (verifierGrille()) {
      afficherMessage("BRAVO");
    } else {
      afficherMessage("PERDU");
    }
  }
}
function verifierGrille() {
  for (var i = 0; i < 81; i++) {
    if (isChiffre(grilleUser[i]) && masque[i] !== true) {
      if (parseInt(chiffres[parseInt(grille.charAt(i))]) !== grilleUser[i]) {
        return false; // La grille n'est pas correcte
      }
    }
  }
  return true; // La grille est correcte
}

function afficherMessage(message) {
  var messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = message;

  setTimeout(function () {
    messageContainer.innerHTML = "";
  }, 5000);
}


// Appelez initGrille pour initialiser la grille avec un niveau par défaut
initGrille(1, false, false);
