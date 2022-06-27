let batePapo=[];
function renderizarBatePapo(){
    const ul = document.querySelector('.batePapo');

    for(let i = 0; i < batePapo.length; i++){
        ul.innerHTML += '
        <li>

        </li>
        '
    }
}