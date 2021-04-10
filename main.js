//References are in the HTML Document
let vueInstance = new Vue({
    el:'#gameON',
    data:{
        current_score:0,
        grid:[
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        nextCell : [0,0]
    },
    created:function(){
        this.grid = this.getRandomNum(this.grid);
        this.grid = this.getRandomNum(this.grid);

    },
    mounted:function(){
        this.applyColorsForCells(this.$refs);
    },
    updated:function(){
        this.applyColorsForCells(this.$refs);
        this.updateCellBorderForNewCell(this.$refs, this.nextCell);
    },
    methods:{

        getRandomNum:function(prevGrid){

            let blankSquares = [];
            for(let i=0; i<prevGrid.length; i++) {
                for(let j=0; j<prevGrid[i].length; j++){
                    if(prevGrid[i][j] === 0){
                        blankSquares.push({
                            x:i,
                            y:j
                        })
                    }
                }
            }
            if(blankSquares.length > 0){
                let rand1 = Math.floor(Math.random() * blankSquares.length);
                prevGrid[blankSquares[rand1].x][blankSquares[rand1].y] = Math.random(1) > 0.5 ? 2 : 4;
                this.nextCell = [blankSquares[rand1].x ,blankSquares[rand1].y]
            }

            return prevGrid;
        },
        keyPressed:function(e){

            let formergrid = this.duplicateGrid(this.grid);
            if(e){
                switch (e.code){
                    case 'ArrowDown':
                        this.keyPressedDown();
                        break;
                    case 'ArrowUp':
                        this.keyPressedUp();
                        break;
                    case 'ArrowLeft':
                        this.keyPressedLeft();
                        break;
                    case 'ArrowRight':
                        this.keyPressedRight();
                        break;
                }
            }
            if(this.compareGrids(formergrid,this.grid)){
                this.grid = this.getRandomNum(this.grid);
                this.applyColorsForCells(this.$refs);

            }
        },
        keyPressedUp: function(){
            this.grid = this.transposeGrid(this.grid);
            this.grid = this.slideArraysInGrid(this.grid, 'left');
            this.grid = this.transposeGrid(this.grid);
        },
        keyPressedDown: function(){
            this.grid = this.transposeGrid(this.grid);
            this.grid = this.slideArraysInGrid(this.grid, 'right');
            this.grid = this.transposeGrid(this.grid);
        },
        keyPressedLeft: function(){
            this.grid = this.slideArraysInGrid(this.grid, 'left');
        },
        keyPressedRight: function(){
            this.grid = this.slideArraysInGrid(this.grid, 'right');
        },
        setScore:function(s){
            this.current_score+=s;
        },


        slideArraysInGrid:function(prevGrid, dir){
            let g = this.duplicateGrid(prevGrid);
            for(let i = 0; i< g.length; i++){
                let lengthOfArray = g[i].length;
                g[i] = g[i].filter(v => v);
                g[i] = this.combineValues(g[i], dir)
                g[i] = g[i].filter(v => v);
                let tempLength = g[i].length;
                for(let k = 0; k< lengthOfArray - tempLength; k++){
                    if(dir === 'left')
                        g[i].push(0);
                    else if(dir === 'right')
                        g[i].unshift(0);
                }
            };
            return g;
        },
        //
        combineValues:function(gridArray, dir){
            if(dir == 'left'){
                for(let i = 0; i< gridArray.length-1; i++){
                    if( gridArray[i]!== 0 && gridArray[i] === gridArray[i+1]){
                        gridArray[i] = gridArray[i]*2;
                        gridArray[i+1] = 0;
                        this.setScore(gridArray[i]);
                    }
                }
            }
            else if(dir == 'right'){
                for(let i = gridArray.length-1; i > -1 ; i--){
                    if( gridArray[i]!== 0 && gridArray[i] === gridArray[i-1]){
                        gridArray[i] = gridArray[i]*2;
                        gridArray[i-1] = 0;
                        this.setScore(gridArray[i]);
                    }
                }
            }

            return gridArray;
        },
        transposeGrid:function(prevGrid){
            let res = [[],[],[],[]];
            for(let i = 0; i<prevGrid.length; i++){
                for(let j = prevGrid[i].length - 1; j > -1; j--){
                    res[j][i] = prevGrid[i][j];
                }
            }
            return res;
        },
        duplicateGrid:function(prevGrid){
            let res = [[],[],[],[]];
            for(let i = 0; i<prevGrid.length; i++){
                for(let j = prevGrid[i].length - 1; j > -1; j--){
                    res[i][j] = prevGrid[i][j];
                }
            }
            return res;
        },
        compareGrids:function(prevGrid, currentGrid){
            for(let i=0; i<prevGrid.length; i++) {
                for(let j=0; j<currentGrid.length; j++){
                    if(prevGrid[i][j]!== currentGrid[i][j])
                        return true;
                }
            }
            return false;

        },
        applyColorsForCells:function(refer){
            let cell;
            let classList = 'col span_1_of_4' ;
            for(let r = 0; r<this.grid.length; r++){
                for(let k = 0; k<this.grid[r].length; k++){
                    cell = refer['counter_'+r+'_'+k][0];
                    cell.classList = [];
                    switch (cell.textContent){
                        case '2':
                        case '4':
                            cell.classList.value=classList + " bg_2_4";
                            break;
                        case '8':
                            cell.classList.value=classList + " bg_8";
                            break;
                        case '16':
                            cell.classList.value=classList + " bg_16";
                            break;
                        case '32':
                            cell.classList.value=classList + " bg_32";
                            break;
                        case '64':
                            cell.classList.value=classList + " bg_64";
                            break;
                        case '128':
                            cell.classList.value=classList + " bg_128";
                            break;
                        case '256':
                            cell.classList.value=classList + " bg_256";
                            break;
                        case '2048':
                            cell.classList.value=classList + " newBorder2048";
                            break;
                        case '':
                            cell.classList.value=classList + "";
                            break;
                        default:
                            cell.classList.value=classList + " bg_high";
                            break;
                    }
                }

            }
        },
        updateCellBorderForNewCell:function(refer, newCell){
            let cell = refer['counter_'+newCell[0]+'_'+newCell[1]][0];
            cell.classList.value = cell.classList.value + " newBorder";
        }

    }

})

document.onkeyup = function(e)
{
    vueInstance.keyPressed(e)
}

function dataSubmit()
{
    alert("Data submitted and stored below!")
}

    const firebaseConfig = {
        apiKey: "AIzaSyBD4K1ZS8S8ddiaCLk2jdSrc_3Osu5vWaA",
        authDomain: "highscore-firestore.firebaseapp.com",
        projectId: "highscore-firestore",
        storageBucket: "highscore-firestore.appspot.com",
        messagingSenderId: "721915455723",
        appId: "1:721915455723:web:5f81be040190e418ab76ae"
    };

    firebase.initializeApp(firebaseConfig)
    const db = firebase.firestore();
    db.settings({});

    const ul = document.getElementById("data_ul")
    const form = document.getElementById("data")

    const renderDataFromDocument = (doc) => renderData(doc.id, doc.data().name, doc.data().points, doc.data().date);

    const renderData = (docId, docName, docPoints, docDate) => {
        let li = document.createElement('li');
        li.className = "collection-item";
        li.setAttribute("data-id", docId);

        let name = document.createElement('p');
        name.className = "name";

        let points = document.createElement('p');
        points.className = "points";

        let date = document.createElement('p');
        date.className = "date";

        name.textContent = docName;
        points.textContent = docPoints;
        date.textContent = docDate;


        li.appendChild(name);
        li.appendChild(points);
        li.appendChild(date);
        ul.appendChild(li);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        db.collection("score").add({
            name: form.name.value,
            points: form.points.value,
            date: form.date.value
        });

        form.name.value = '';
        form.points.value = '';
        form.date.value = '';
    })


    db.collection("score").orderBy("points", "desc").onSnapshot(
        snapshot => {
            let changes = snapshot.docChanges();
            console.log(changes)
            changes.forEach(
                change => {
                    console.log(change.doc.data())
                    switch (change.type) {
                        case "added":
                            renderDataFromDocument(change.doc);
                            break;
                    }

                }
            )
        }
    );




