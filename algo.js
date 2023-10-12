function checkTermination(matrix, n, m) {
    for ( let i = 0; i < m - 1; i ++ ) {
        if ( matrix[n - 1][i] > 0 )
        {
            return false;
        }
    }

    return true;
}

function getVal() {
    
    document.getElementById("steps").innerHTML = '';
    let n = document.getElementById("n").value;
    let m = document.getElementById("m").value;

    let matrix = new Array(n);

    for (let i = 0; i < n; i ++) {

        let arr = new Array(m);

       for(let j=0; j<m; j++) {
            const inputId = "u" + (i + 1) + "x" + (j + 1);
            const inputValue = parseFloat(document.getElementById(inputId).value);
            
            arr[j] = inputValue;
       }

       matrix[i] = arr;
    }

    let upper_row = new Array(m - 1);

    for (let i = 0; i< m - 1; i ++) {
        upper_row[i] = {ch: "X", index: i + 1};
        console.log(upper_row[i]);
    }

    let left_col = new Array(n - 1);

    for (let i = 0; i < n - 1; i ++) {
        left_col[i] = {ch: "U", index: i + 1};
        console.log(left_col[i]);
    }

    let z = new Array(m - 1);

    for (let i = 0; i < m - 1; i ++) {
        z[i] = matrix[n-1][i];
    }

    let B = 1;

    while (!checkTermination(matrix, n, m)) {
        let step = 1;

        let matrix_copy = new Array(n);

        for ( let i = 0; i < n; i ++ ) {
            let arr = new Array(m);
            
            for ( let j = 0; j < m; j ++ ) {
                arr[j] = matrix[i][j];
            }

            matrix_copy[i] = arr;
        }

        let sz = "";

        sz += "<h2>Step " + B + "." + step + "</h2><br>";
        sz += "<p>Choosing the column of the generator element " +
        "(the column of the greatest positive coefficient value from the target function).</p><br>";

        let gen_row; 
        let gen_col; 
        let z_max = 0.0;

        for (let i = 0; i <m-1; i ++ ) {
            if(z_max < matrix[n-1][i])
            {
                z_max = matrix[n-1][i];
                gen_col = i;
            }
        }

        if (z_max === 0.0){
            console.log("Could not find the z_max value"); // TODO
        }

        sz += "<p>Column of the generator element: " + (gen_col + 1) + "</p>";

        step ++;

        sz += "<h2>Step " + B + "." + step + "</h2><br>";
        sz += "<p> Choosing the row of the generator element " +
        "(the row of the lowest positive division value of the value of " +
        "the matrix from the chosen column divided by the resources and " +
        "limitations column).</p><br>";

        let smallest_div = Number.MAX_VALUE;
        let generator_element;

        for (let i = 0; i <n-1; i++){
            if(matrix[i][gen_col] > 0 && matrix[i][m-1]/matrix[i][gen_col] < smallest_div)
            {
                smallest_div = matrix[i][m-1]/matrix[i][gen_col];
                gen_row=i;

            }
        }

        if (smallest_div < 1e-6 ){
            console.log("Precision error occured"); // TODO
        }

        sz += "<p>Row of the generator element: " + (gen_row + 1) + "</p>";

        step ++;

        sz += "<h2>Step " + B + "." + step + "</h2><br><p>Determining the generator element.</p><br>";

        generator_element = matrix[gen_row][gen_col];

        sz += "<p>The generator element: " + generator_element.toFixed(4) + "</p>";

        step ++;

        sz += "<h2>Step " + B + "." + step + "</h2><br>";
        sz += "<p>Making the transformation " +
        "(multiplying the row of the generator element by the " +
        "reciprocal of the generator element, " +
        "multiplying the column of the generator element by the " +
        "reciprocal times (-1) of the generator element, " +
        "setting equal the generator element to it's reciprocal) + " +
        "switch the generator column with the generator row (switch place [xi " +
        "and ui]).</p><br>";

        let h = upper_row[gen_col];
        upper_row[gen_col] = left_col[gen_row];
        left_col[gen_row] = h;

        for (let i = 0; i < m; i ++) {
            if(matrix[gen_row][i] != 0.0)
            {
                matrix[gen_row][i] *= 1 / generator_element;
            }
        }
        
        for (let i = 0; i < n; i ++) {
            if(matrix[i][gen_col] != 0.0)
            {
                matrix[i][gen_col] *= (-1) * 1 / generator_element;
            }
        }

        matrix[gen_row][gen_col] = 1 / generator_element;

        step ++;

        sz += "<h2>Step " + B + "." + step + "</h2><br>";
        sz += "<p>Making the base transformation " +
        "(to the original matrix, divide the matrix elements in the row " +
        "of the generator element by the original generator element, " +
        "then except the generator row and generator column, " +
        "substitute the value from the matrix at the actual row and " +
        "generator column " +
        "from every elements of the matrix times the value itself).</p><br>";

        for (let i = 0; i < m; i ++) {
            matrix_copy[gen_row][i] /= generator_element;
        }

        for (let i = 0; i < n; i ++) {
            if(i != gen_row) {
                let mul = matrix_copy[i][gen_col];
                for(let j = 0; j < m; j++) {
                    matrix_copy[i][j] -= matrix_copy[gen_row][j] * mul;
                    if(i != gen_row && j != gen_col) {
                        matrix[i][j] = matrix_copy[i][j];
                    }
                }
            }
        }

        sz += "<h2>Next simplex table after the transformation:</h2><br>";
        sz += "<table id = 'tabla' class='table table-dark table-striped' '>";

        n ++;
        m ++;

        for ( let i = 0; i < n; i ++ ) {
            sz += "<tr>";

            for ( let j = 0; j < m; j ++ ) {
                if(i==gen_row && j==0)
                {
                    sz+="<th>"+left_col[i].ch+"<sub>"+left_col[i].index+"</sub></th>";
                }else if(i==0 && j==gen_col){
                    sz+="<th>"+upper_row[j].ch+"<sub>"+upper_row[j].index+"</sub></th>";
                }else if ( i == 0 && j == 0 ) {
                    sz += "<th>B<sub>" + B + "</sub></th>";
                }else if ( i != 0 && j != 0 )  {
                    sz += "<td>" + matrix[i - 1][j - 1].toFixed(2) + "</td>";
                }else if ( i == 0 && j == m - 1 ) {
                    sz += "<th>b</th>";
                }
                else if ( i == n - 1 && j == 0 ) {
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

        n --;
        m --;

        sz += "</table>";

        document.getElementById("steps").innerHTML += sz;

        B ++;
    }

    sz = "";

    console.log(upper_row);
    console.log(left_col);

    for (let i = 0; i < m - 1; i ++) {
        if(upper_row[i].ch == "X") {
            sz += "<p>X" + upper_row[i].index + " = " + matrix[n - 1][i].toFixed(2) ;
            if(matrix[n - 1][i] < 0) {
                sz += " (0)";
            }
            sz+="</p>";
        }
    }

    for (let i = 0; i < n - 1; i ++) {
        if(left_col[i].ch == "X") {
            sz += "<p>X" + left_col[i].index + " = " + matrix[i][m - 1].toFixed(2) ;
            if(matrix[i][m - 1] < 0) {
                sz += " (0)";
            }
            sz+="</p>";
        }
    }

    sz += "<p>THE MAXIMUM OF THE TARGET FUNCTION AFTER THE OPTIMALIZATION: " + -1 * matrix[n - 1][m - 1].toFixed(4) + "</p>";

    document.getElementById("steps").innerHTML += sz;
}

let h = {ch: upper_row.ch , index:upper_row.index};
upper_row.ch = left_column.ch
upper_row.index = left_column.index
left_column.ch = h.ch;
left_column.index = h.index