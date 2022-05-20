max_iterations = 10
required_accuracy = 0.0001
round_to = 3

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function update_default_values(){
    max_iterations = parseInt(document.getElementById('max-iterations').value)
    required_accuracy = document.getElementById("required-accuracy").value
    round_to = parseInt(document.getElementById("round-to").value)

    if (isNaN(max_iterations)) {
        max_iterations = 10
    }
    if (isNaN(round_to)) {
        round_to = 3
    }
    if (required_accuracy == "") {
        required_accuracy = 0.0001
    }
}

function newton_raphson() {

    f = document.getElementById('function').value
    a = document.getElementById("initial-guess-a").value

    update_default_values()

    parser = math.parser()
    parser.evaluate('f(x)=' + f)
    parser.evaluate("df(x)="+math.derivative(f, 'x').toString())
    if (Math.abs(parser.evaluate(`f(${a})`)) < required_accuracy) {
        alert("Give initial guess is the solution")
        return;
    }
    terminator = "Max Iterations Reached"
    iterations = []
    x = a
    for (let i = 0; i < max_iterations + 1; i++) {
        fx = parser.evaluate(`f(${x})`)
        dfx = parser.evaluate(`df(${x})`)
        iterations.push([i, x, fx, dfx])
        if (Math.abs(fx) == 0) {
            terminator = "Found Exact Solution"
            break
        } else if (Math.abs(fx) < required_accuracy) {
            terminator = "Found Approx. Solution"
            break
        } else if (dfx == 0) {
            terminator = "Zero derivative. No Solution Found"
            break
        } else {
            x = x - fx / dfx
        }
    }
    names = ["#", "x", "f(x)", "f'(x)"]
    showResults(names, iterations, round_to, terminator)
}


function non_linear() {
    f = document.getElementById('function').value
    a = document.getElementById("initial-guess-a").value
    b = document.getElementById("initial-guess-b").value

    update_default_values()
    method = document.querySelector('input[name="method"]:checked').value

    parser = math.parser()
    parser.evaluate('f(x)=' + f)
    if (parser.evaluate(`f(${a})*f(${b})`) > 0) {
        alert("f(a) * f(b) > 0 ");
        return;
    }
    if (parser.evaluate(`f(${a})*f(${b})`) == 0) {
        alert("f(a) * f(b) = 0");
        return;
    }
    if (method == "Bisection") {
        let [terminator, iterations] = bisection_helper(a, b, max_iterations, required_accuracy, parser)
    } else if (method == "Secant") {
        let [terminator, iterations] = secant_helper(a, b, max_iterations, required_accuracy, parser)
    } else if (method == "Regula-Falsi") {
        let [terminator, iterations] = regula_falsi_helper(a, b, max_iterations, required_accuracy, parser)
    } else {
        alert("Invalid Method Selected")
        return;
    }

    names = ["#", "a", "b", "c", "f(a)", "f(b)", "f(c)"]
    showResults(names, iterations, round_to, terminator)
}

function bisection_helper(a, b, max_iterations, required_accuracy, parser) {

    terminator = "Max Iterations Reached"
    iterations = []

    for (let i = 0; i < max_iterations + 1; i++) {
        c = (a + b) / 2
        fa = parser.evaluate(`f(${a})`)
        fb = parser.evaluate(`f(${b})`)
        fc = parser.evaluate(`f(${c})`)
        iterations.push([i, a, b, c, fa, fb, fc])
        if (fc == 0) {
            terminator = "Found Exact Solution"
            break
        } else if (Math.abs(fc) < required_accuracy) {
            terminator = "Found Approx. Solution"
            break
        } else if (fa * fc < 0) {
            b = c;
        } else if (fb * fc < 0) {
            a = c
        } else {
            alert("Bisection Method Failed")
            break
        }
    }
    return [terminator, iterations]
}

function secant_helper(a, b, max_iterations, required_accuracy, parser) {
    terminator = "Max Iterations Reached"
    iterations = []

    for (let i = 0; i < max_iterations + 1; i++) {
        fa = parser.evaluate(`f(${a})`)
        fb = parser.evaluate(`f(${b})`)
        c = ((a * fb) - (b * fa)) / (fb - fa)
        fc = parser.evaluate(`f(${c})`)
        iterations.push([i, a, b, c, fa, fb, fc])
        if (fc == 0) {
            terminator = "Found Exact Solution"
            break
        } else if (Math.abs(fc) < required_accuracy) {
            terminator = "Found Approx. Solution"
            break
        } else {
            a = b
            b = c
        }
    }
    return [terminator, iterations]
}


function regula_falsi_helper(a, b, max_iterations, required_accuracy, parser) {
    terminator = "Max Iterations Reached"
    iterations = []

    for (let i = 0; i < max_iterations + 1; i++) {
        fa = parser.evaluate(`f(${a})`)
        fb = parser.evaluate(`f(${b})`)
        c = ((a * fb) - (b * fa)) / (fb - fa)
        fc = parser.evaluate(`f(${c})`)
        iterations.push([i, a, b, c, fa, fb, fc])
        if (fc == 0) {
            terminator = "Found Exact Solution"
            break
        } else if (Math.abs(fc) < required_accuracy) {
            terminator = "Found Approx. Solution"
            break
        } else if (fa * fc < 0) {
            b = c;
        } else if (fb * fc < 0) {
            a = c
        } else {
            alert("Regula-Falsi Method Failed")
            break
        }
    }
    return [terminator, iterations]
}

function simple_iterative() {
    f = document.getElementById('function').value
    df = document.getElementById('derivation').value
    a = document.getElementById("initial-guess-a").value

    update_default_values()

    parser = math.parser()
    parser.evaluate('f(x)=' + f)
    parser.evaluate('df(x)=' + df)
    if (Math.abs(parser.evaluate(`df(${a})`)) < required_accuracy) {
        alert("Give initial guess is the solution")
        return;
    }
    terminator = "Max Iterations Reached"
    iterations = []
    iterations.push([a])
    for (let i = 0; i < max_iterations; i++) {
        iterations.push([parser.evaluate(`df(${iterations[i][0]})`)])
        if (Math.abs(iterations[i + 1][0] - iterations[i][0]) < required_accuracy) {
            terminator = "Found Approx. Solution"
        }
    }
    names = ["x"]
    showResults(names, iterations, round_to, terminator)
}

function showResults(headings, values, round_to, terminator) {

    table = '<table class="table table-striped">'
    theading = `<h6>${terminator}</h6>`
    thead = "<thead>\n<tr>"
    for (let i = 0; i < headings.length; i++) {
        thead += "<th>" + headings[i] + "</th>"
    }
    thead += "</tr>\n</thead>"
    tdata = "<tbody>"
    for (value of values) {
        tdata += "<tr>"
        for (data of value) {
            try {
                tdata += "<td>" + data.round(round_to) + "</td>"
            } catch (err) {
                tdata += "<td>" + data + "</td>"
            }
        }
        tdata += "</tr>"
    }
    tdata += "</tbody>"
    table += thead
    table += tdata
    table += "</table>"
    html = theading + table
    document.getElementById("result").innerHTML = html
}

function variable_list_to_string(variable_list) {
    variable_string = ""
    for (variable of variable_list) {
        variable_string += variable + ","
    }
    return variable_string.slice(0, -1)
}

function is_satisified(variable_list, f_list, parser) {
    for (f of f_list) {
        if (parser.evaluate(`${f}(${variable_list_to_string(variable_list)})`) != 0) {
            return false
        }
    }
    return true
}
function is_approx(variable_list, f_list, required_accuracy, parser) {
    for (f of f_list) {
        console.log(f + " : " + Math.abs(parser.evaluate(`${f}(${variable_list_to_string(variable_list)})`)))
        if (Math.abs(parser.evaluate(`${f}(${variable_list_to_string(variable_list)})`)) > required_accuracy) {
            return false
        }
    }
    return true
}

function jacobi_and_guass_seiled_helper(no_of_iterations, variable_list, function_list, f_list, required_accuracy, method) {
    if (method != 'jacobi' && method != 'guass-seidel') {
        alert('Method must be Jacobi or Guass Seiled' + method)
        return NaN
    }
    terminator = "Max Iterations Reached"
    iterations = []
    iterations.push(variable_list)
    variable_string = ""
    registered_function_list = []
    registered_f_list = []
    parser = math.parser()
    for (let i = 1; i <= variable_list.length; i++) {
        variable_string += 'x' + i + ','
    }
    variable_string = variable_string.slice(0, -1)
    for (let i = 0; i < variable_list.length; i++) {
        registered_function_list[i] = `func${i}`
        registered_f_list[i] = `f${i}`
        parser.evaluate(`${registered_function_list[i]}(${variable_string})=${function_list[i]}`)
        parser.evaluate(`${registered_f_list[i]}(${variable_string})=${f_list[i]}`)
    }
    for (let i = 0; i < no_of_iterations; i++) {
        current_iteration = []
        if (method == 'jacobi') {
            variable_string = variable_list_to_string(iterations[i])

            for (let j = 0; j < variable_list.length; j++) {
                console.log(`${registered_f_list[j]}(${variable_string})`)
                current_iteration.push(parser.evaluate(`${registered_f_list[j]}(${variable_string})`))
            }
        } else if (method == 'guass-seidel') {
            variable_string = ""
            for (let j = 0; j < variable_list.length; j++) {
                variable_string = ""
                for (let k = 0; k < variable_list.length; k++) {
                    if (k < j) {
                        variable_string += current_iteration[k] + ","
                    } else {
                        variable_string += iterations[i][k] + ","
                    }
                }
                variable_string = variable_string.slice(0, -1)
                current_iteration.push(parser.evaluate(`${registered_f_list[j]}(${variable_string})`))
            }
        }
        iterations.push(current_iteration)
        if (is_satisified(current_iteration, registered_function_list, parser)) {
            terminator = "Found Exact Solution"
            break
        } else if (is_approx(current_iteration, registered_function_list, required_accuracy, parser)) {
            terminator = "Found Approx. Solution"
            break
        }
    }
    return [terminator, iterations]
}

function jacobi_and_guass_seiled(param) {
    let no_of_variables = document.getElementById('dimensions').value
    if (no_of_variables == "") {
        no_of_variables = 3
    }
    if (no_of_variables < 2) {
        alert("No of variables can't be less than 2")
        return;
    }
    let function_object = document.getElementById('functions')
    let derivation_object = document.getElementById('derivations')
    let initial_object = document.getElementById('initial-guess')
    let functions_object = function_object.getElementsByClassName('function')
    let derivations_object = derivation_object.getElementsByClassName('derivation')
    let initials_object = initial_object.getElementsByClassName('initial-guess')
    if (param == 'expand_input') {
        if (functions_object.length != derivations_object.length || functions_object.length != initials_object.length) {
            alert('Count of functions, derivations, and initial guess is not same')
            return;
        }
        if (no_of_variables == functions_object.length) {
            // alert('requirement already satisified')
            return;
        } else if (no_of_variables > functions_object.length) {
            func_obj = functions_object[0].cloneNode(true)
            deri_obj = derivations_object[0].cloneNode(true)
            init_obj = initials_object[0].cloneNode(true)
            func_obj.value = ""
            deri_obj.value = ""
            init_obj.value = ""
            for (let i = functions_object.length; i < no_of_variables; i++) {
                function_object.appendChild(func_obj.cloneNode(true))
                function_object.appendChild(document.createElement('br'))
                derivation_object.appendChild(deri_obj.cloneNode(true))
                derivation_object.appendChild(document.createElement('br'))
                initial_object.appendChild(init_obj.cloneNode(true))
                initial_object.appendChild(document.createElement('br'))
            }
        } else if (no_of_variables < functions_object.length) {
            function_brs = function_object.getElementsByTagName('br')
            derivation_brs = derivation_object.getElementsByTagName('br')
            initial_brs = initial_object.getElementsByTagName('br')
            for (let i = no_of_variables; i < functions_object.length; i++) {
                function_object.removeChild(functions_object[i])
                function_object.removeChild(function_brs[i])
                derivation_object.removeChild(derivations_object[i])
                derivation_object.removeChild(derivation_brs[i])
                initial_object.removeChild(initials_object[i])
                initial_object.removeChild(function_brs[i])
            }

        }
        return;
    }
    method = document.querySelector('input[name="method"]:checked').value
    let [functions, derivations, initial_guess] = [[], [], []]
    for (let i = 0; i < no_of_variables; i++) {
        functions.push(functions_object[i].value)
        derivations.push(derivations_object[i].value)
        initial_guess.push(initials_object[i].value)
    }

    update_default_values()

    let [terminator, iterations] = jacobi_and_guass_seiled_helper(max_iterations, initial_guess, functions, derivations, required_accuracy, method)
    names = []
    for (let i = 1; i <= functions.length; i++) {
        names.push("x" + i)
    }
    showResults(names, iterations, round_to, terminator)
}


function newton_interpolation(param) {
    let no_of_points = document.getElementById('dimensions').value
    if (no_of_points == "") {
        no_of_points = 5
    }
    if (no_of_points < 5) {
        alert("No of Points can't be less than 5")
        return;
    }

    let x_value_object = document.getElementById('x_values')
    let y_value_object = document.getElementById('y_values')
    let x_objects = x_value_object.getElementsByClassName('x')
    let y_objects = y_value_object.getElementsByClassName('y')

    if (param == 'expand_input') {
        if (x_objects.length != y_objects.length) {
            alert('Count of x and y is not same')
            return;
        }
        if (no_of_points == x_objects.length) {
            // alert('requirement already satisified')
            return;
        } else if (no_of_points > x_objects.length) {
            x_object = x_objects[0].cloneNode(true)
            y_object = y_objects[0].cloneNode(true)
            x_object.value = ""
            y_object.value = ""
            for (let i = x_objects.length; i < no_of_points; i++) {
                x_value_object.appendChild(document.createElement('br'))
                x_value_object.appendChild(x_object.cloneNode(true))
                y_value_object.appendChild(document.createElement('br'))
                y_value_object.appendChild(y_object.cloneNode(true))
            }
        } else if (no_of_points < x_objects.length) {
            x_brs = x_value_object.getElementsByTagName('br')
            y_brs = y_value_object.getElementsByTagName('br')
            for (let i = no_of_points; i < x_objects.length; i++) {
                x_value_object.removeChild(x_objects[i])
                // x_value_object.removeChild(x_brs[i])
                y_value_object.removeChild(y_objects[i])
                // y_value_object.removeChild(y_brs[i])
            }
        }
        return;
    }
    operation = document.querySelector('input[name="operation"]:checked').value
    method = document.querySelector('input[name="method"]:checked').value
    xp = document.getElementById('xp').value;
    // difference table construction
    let differentiation_table = [[], []];
    for (let i = 0; i < no_of_points; i++) {
        differentiation_table[0].push(x_objects[i].value)
        differentiation_table[1].push(y_objects[i].value)
    }
    index = 1;
    while (true) {
        differentiation_table.push([])
        index++
        for (let i = 0; i < differentiation_table[index - 1].length - 1; i++) {
            try {
                differentiation_table[index][i] = differentiation_table[index - 1][i + 1] - differentiation_table[index - 1][i]
            } catch {

                differentiation_table[index][i] = null
            }
        }
        if (!differentiation_table[index].some(item => item !== null && item !== 0)) {
            break;
        }
    }
    differentiation_table = differentiation_table[0].map((_, colIndex) => differentiation_table.map(row => row[colIndex]))
    let h = differentiation_table[1][0] - differentiation_table[0][0]
    differences = []
    for (let i = 0; i < differentiation_table.length - 1; i++) {
        differences.push(Math.abs(differentiation_table[i][0] - xp))
    }
    let minIndex = differences.indexOf(Math.min(...differences))

    if (method == 'Optimal') {
        let center = Math.floor(differentiation_table.length / 2)
        if (minIndex <= center) {
            method = 'Forward'
        } else {
            method = 'Backward'
        }
    }

    if (method == 'Backward') {
        for (let j = 2; j < differentiation_table[0].length; j++) {
            for (let i = differentiation_table.length - 1; i >= 0; i--) {
                try {
                    differentiation_table[i][j] = differentiation_table[i + 1 - j][j]
                } catch {
                    differentiation_table[i][j] = undefined
                }
            }
        }
    }

    if (method == 'Forward') {
        while (differentiation_table[minIndex][3] == undefined) {
            minIndex--
        }
    } else if (method == 'Backward') {
        while (differentiation_table[minIndex][3] == undefined) {
            console.log(differentiation_table[minIndex][3])
            console.log(minIndex)
            minIndex++
        }
    }

    let p = (xp - differentiation_table[minIndex][0]) / h

    if (operation == 'Interpolation') {
        results = parseFloat(differentiation_table[minIndex][1])
        if (method == 'Forward') {
            expand = (p, j) => p - j
        } else if (method == 'Backward') {
            expand = (p, j) => p + j
        }
        let i = 1;
        while (differentiation_table[minIndex][i + 1] !== undefined) {
            let p_multipliers = p
            for (let j = 1; j < i; j++) {
                p_multipliers *= expand(p, j)
            }
            results += (differentiation_table[minIndex][i + 1] * p_multipliers) / factorial(i)
            i++
        }

    } else if (operation == 'Differentiation') {
        if (method == 'Forward') {
            results = parseFloat(differentiation_table[minIndex][2]) +
                ((2 * p - 1) / 2) * differentiation_table[minIndex][3] +
                ((3 * (p * p) - 6 * p + 2) / 6) * differentiation_table[minIndex][4]
            results /= h
        } else if (method == 'Backward') {
            // formula missing here
        }
    }

    // difference table headings construction
    let names = ["x", "y"]
    if (method == 'Forward') {
        for (let i = 1; i < index; i++) {
            names.push(`Δ<super>${i}</super>y`)
        }
    } else if (method == 'Backward') {
        for (let i = 1; i < index; i++) {
            names.push(`∇<super>${i}</super>y`)
        }
    }
    results = results.round(5)
    showResults(names, differentiation_table, 3, `Method: ${method}, Result: ${results}`)
}


function factorial(n) {
    if (n < 0) {
        console.log('Error! Factorial for negative number does not exist.');
        return;
    }
    var fact = 1;
    for (var i = 2; i <= n; i++)
        fact *= i;
    return fact;
}


function integration(param) {
    let no_of_points = document.getElementById('dimensions').value
    if (no_of_points == "") {
        no_of_points = 5
    }
    if (no_of_points < 2) {
        alert("No of Points can't be less than 2")
        return;
    }

    let y_value_object = document.getElementById('y_values')
    let y_objects = y_value_object.getElementsByClassName('y')

    if (param == 'expand_input') {
        if (no_of_points == y_objects.length) {
            // alert('requirement already satisified')
            return;
        } else if (no_of_points > y_objects.length) {
            y_object = y_objects[0].cloneNode(true)
            y_object.value = ""
            for (let i = y_objects.length; i < no_of_points; i++) {
                y_value_object.appendChild(document.createElement('br'))
                y_value_object.appendChild(y_object.cloneNode(true))
            }
        } else if (no_of_points < y_objects.length) {
            y_brs = y_value_object.getElementsByTagName('br')
            for (let i = no_of_points; i < y_objects.length; i++) {
                // x_value_object.removeChild(x_brs[i])
                y_value_object.removeChild(y_objects[i])
                // y_value_object.removeChild(y_brs[i])
            }
        }
        return;
    }
    method = document.querySelector('input[name="method"]:checked').value
    if(method=="Optimal"){
        if(y_objects.length==7){
            method = "Weddle's Rule"
        }else if(y_objects.length==5){
            method = "Boole's Rule"
        }else if(y_objects.length%2==0){
            method = "Simpsons 1/3"
        }else{
            method = "Trapezium"
        }
    }
    h = document.getElementById('h').value
    area = 0;
    y_values = []
    for(let i=0; i<y_objects.length; i++){
        y_values.push(parseFloat(y_objects[i].value))
    }
    switch(method){
        case "Trapezium":
            for(let i=1; i<y_values.length-1; i++){
                area += y_values[i]
            }
            area *= 2
            area += y_values[0] + y_values[y_values.length-1]
            area *= h/2
            break
        case "Simpsons 1/3":
            if(y_values.length%2 != 0){
                alert("Simpsons 1/3 Rule can't be applied")
                return
            }
            even_sum = 0, odd_sum=0
            other_sum = y_values[0] + y_values[y_values.length-1]
            for(let i=1; i<y_values.length-1; i+=2){
                odd_sum += y_values[i]
            }
            for(let i=2; i<y_values.length-1; i+=2){
                even_sum += y_values[i]
            }
            alert("even sum " + even_sum)
            alert("odd sum " + odd_sum)
            alert("other sum" + other_sum)
            area = h/3*(other_sum + 4*odd_sum + 2*even_sum)
            break
        case "Boole's Rule":
            multipliers = [7, 32, 12, 32, 7]
            if(y_values.length != 5){
                alert("Boole's Rule can't be applied")
                return
            }
            for(let i=0; i<5; i++){
                area += y_values[i] * multipliers[i]
            }
            area = (area*2*h)/45
            break
        case "Weddle's Rule":
            multipliers = [1, 5, 1, 6, 1, 5, 1]
            if(y_values.length != 7){
                alert("Weddle's Rule can't be applied")
                return
            }
            for(let i=0; i<7; i++){
                area += y_values[i] * multipliers[i]
            }
            area = (area*3*h)/10
            break
        default:
            alert("No such method " + method)
            return
    }

    // difference table headings construction
    let names = []
    let differentiation_table = []
    
    area = area.round(5)
    showResults(names, differentiation_table, 3, `Method: ${method}, Result: ${area}`)
}

function solution_of_ode(){
    f = document.getElementById('function').value
    x0 = parseFloat(document.getElementById('x0').value)
    y0 = parseFloat(document.getElementById('y0').value)
    xn = parseFloat(document.getElementById('xn').value)
    h = parseFloat(document.getElementById('h').value)
    method = document.querySelector('input[name="method"]:checked').value

    update_default_values()

    results = [[x0, y0]]
    parser = math.parser()
    parser.evaluate('f(x,y)=' + f)
    x = x0, y=y0;
    
    names = ['xn', 'yn']
    if(method=='Eular'){
        let i=0;
        do{
            y = results[i][1] + h*parser.evaluate(`f(${x},${y})`)
            x +=h
            i+=1
            results.push([x, y])
        }while(x<xn)
    }else if(method=='Taylor'){
        parser.evaluate("df(x,y)="+math.derivative(f, 'x').toString())
        parser.evaluate("df2(x,y)="+math.derivative(math.derivative(f, 'x').toString(), 'x'))
        // parser.evaluate("df3(x,y)="+parser.derivative(parser.derivative(math.derivative(f, 'x').toString(), 'x'), 'x'))
    
        let i=0;
        do{
            y = y + h*parser.evaluate(`f(${x},${y})`) + h*h*parser.evaluate(`df(${x},${y})`)/2 + h*h*h*parser.evaluate(`df2(${x},${y})`)/6
            x +=h
            i+=1
            results.push([x, y])
        }while(x<xn)
    }else if(method=='Range Kutta'){
        results[0] = [x,y,0,0,0,0]
        let i=0;
        do{
            k1 = h * parser.evaluate(`f(${x},${y})`)
            k2 = h * parser.evaluate(`f(${x+h/2},${y+k1/2})`)
            k3 = h * parser.evaluate(`f(${x+h/2},${y+k2/4})`)
            k4 = h * parser.evaluate(`f(${x+h},${y+k3})`)
            y = y + (1/6)*(k1 + 2*k2 + 2*k3 + k4)
            // y = y + h*parser.evaluate(`f(${x},${y})`) + h*h*parser.evaluate(`df(${x},${y})`)/2 + h*h*h*parser.evaluate(`df2(${x},${y})`)/6
            x +=h
            i+=1
            results.push([x, y, k1, k2, k3, k4])
            names = ['xn', 'yn', 'k1', 'k2', 'k3', 'k4']
        }while(x<xn)
    }

    y = y.round(5)
    showResults(names, results, 3, `Method: ${method}, Result: ${y}`)

}
