function setTableSize() {
    document.getElementById("steps").innerHTML = '';
    let row = document.getElementById("n").value;
    let column = document.getElementById("m").value;

    let sz = "<table id = 'tabla' class='table table-dark table-striped' '>";

    row ++;
    column ++;

    for ( let i = 0; i < row; i ++ ) {
        sz += "<tr>";

        for ( let j = 0; j < column; j ++ ) {
            if ( i == 0 && j == 0 ) {
                sz += "<th>B<sub>0</sub></th>";
            }else if ( i == row - 1 && j == column - 1 ) {
                sz += "<td><input type='number' class='bevitel' id='u" + i + "x" + j + "' readonly value = '0'></td>";
            }else if ( i != 0 && j != 0 )  {
                sz += "<td><input type='number' class='bevitel' id='u" + i + "x" + j + "'></td>";
            }else if ( i == 0 && j == column - 1 ) {
                sz += "<th>b</th>";
            }
            else if ( i == row - 1 && j == 0 ) {
                sz += "<th>Z</th>";
            }
            else if ( i == 0 && j != 0 ) {
                sz += "<th>X<sub>" + j + "</sub></th>";
            }else if ( i != 0 && j == 0 ) {
                sz += "<th>U<sub>" + i + "</sub></th>";
            }
        }

        sz += "</tr>";
    }

    sz += "</table>";

    document.getElementById("table_position").innerHTML = sz;
}