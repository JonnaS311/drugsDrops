const alarmaLista = document.querySelector('#alarm-list')
//Constante que busca la información en el ejs
const alarmString = alarmaLista.dataset.info;
const tituloCajon = document.querySelector('#cajon-titulo')
const idCajon = tituloCajon.dataset.cajon
const nameUsuario = alarmaLista.dataset.usuario
const idUsuario = alarmaLista.dataset.idusuario
//Pasar de String a Array
let alarms = JSON.parse(alarmString)
let diaFecha = ""
let estadoAlarma = false
let segundosRestantes = 0;

const formularioAlarma = document.querySelector('#formularioAlarma')
const btnAlarma = document.querySelector('#btnAlarma')
const formularioAlarmaPreparada = document.querySelector('#formularioAlarmaPreparada')
const btnEliminar = document.querySelector('#btnEliminar')


class Clock {
    locale = 'es-ES'
    init() {

        this.displayAlarms();
        setInterval(this.build, 1000);
    }

    build = () => {
        const clockEl = document.getElementById('digital-clock');
        let fecha = new Date
        segundosRestantes = 60000 - (fecha.getSeconds() * 1000)
        let time = this.toLocalTimeString(fecha);
        clockEl.innerHTML = time + " - " + this.dateDay(fecha.getDay());

        fecha.setSeconds(0)
        time = this.toLocalTimeString(fecha);
        console.log(time)
        this.checkAlarms(time);
    }

    clearForm = () => {
        document.getElementById('hour').value = "0";
        document.getElementById('minute').value = "0";
        // document.getElementById('second').value = "0";
        document.getElementById('hour').focus();
    }

    addAlarm = () => {
        const date = new Date;
        date.setHours(document.getElementById('hour').value)
        date.setMinutes(document.getElementById('minute').value)
        // date.setSeconds(document.getElementById('second').value)
        date.setSeconds(0)
        return date
    }

    renderAlarm = (alarm, alarmList, i) => {
        const option = document.createElement('option')
        let dayString = ""
        option.value = i;
        for (let i = 0; i < alarm.day.length; i++) {
            dayString += this.dateDay(alarm.day[i]) + " "
        }
        option.innerHTML = `Alarma Preparada: ${alarm.hour} - Días: ${dayString}`;
        alarmList.appendChild(option);
    }

    displayAlarms = () => {
        const alarmList = document.getElementById('alarm-list-select');
        alarmList.innerHTML = "     ";
        for (let i = 0; i < alarms.length; i++) {
            if (alarms[i].cajon == idCajon) {
                this.renderAlarm(alarms[i], alarmList, i);
            }
        }
    }

    checkAlarms = (time) => {
        const fecha = new Date
        diaFecha = this.dateDayNumber(this.dateDay(fecha.getDay()))

        for (let i = 0; i < alarms.length; i++) {

            const alarm = alarms[i].hour
            // if (alarm === time && alarms[i].cajon == idCajon)
            if (alarm === time) {
                let alarmaPosible = alarms[i]
                for (let i = 0; i < alarmaPosible.day.length; i++) {
                    if (alarmaPosible.day[i] == diaFecha && estadoAlarma == false) {
                        estadoAlarma = true

                        // alarms.splice(i, 1);
                        // this.displayAlarms();
                        let timerInterval
                        Swal.fire({
                            title: `Alarma para: ${alarm} - Cajón: ${alarmaPosible.cajon} - Compartimiento: ${alarmaPosible.info}`,
                            width: 600,
                            padding: '3em',
                            color: '#716add',
                            imageUrl: 'https://media1.giphy.com/media/gx54W1mSpeYMg/giphy.gif',
                            imageWidth: 400,
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            backdrop: `
                        rgba(0,0,123,0.4)
                        `,
                            html: 'Cerrando aviso en <b></b> milliseconds.',
                            timer: 6000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading()
                                const b = Swal.getHtmlContainer().querySelector('b')
                                timerInterval = setInterval(() => {
                                    b.textContent = Swal.getTimerLeft()
                                }, 100)
                            },
                            willClose: () => {
                                clearInterval(timerInterval)
                            }
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log('I was closed by the timer')
                            }

                        })
                        
                        setTimeout(cambioEstado, segundosRestantes)
                        // setTimeout(deleteAlarm, 7000, alarmaPosible._id)
                    }
                }
            }
        }
    }

    toLocalTimeString = (date) => {
        //Formato reloj
        return date.toLocaleTimeString(
            this.locale,
            {
                hours: '2-digit',
                minutes: '2-digit',
                seconds: '2-digit',

            }
        )
    }

    dateDay(day) {
        if (day == 1) {
            return 'Lunes'
        } else if (day == 2) {
            return 'Martes'
        } else if (day == 3) {
            return 'Miércoles'
        } else if (day == 4) {
            return 'Jueves'
        } else if (day == 5) {
            return 'Viernes'
        } else if (day == 6) {
            return 'Sábado'
        } else if (day == 0) {
            return 'Domingo'
        }
    }

    dateDayNumber(day) {
        if (day == 'Lunes') {
            return '1'
        } else if (day == 'Martes') {
            return '2'
        } else if (day == 'Miércoles') {
            return '3'
        } else if (day == 'Jueves') {
            return '4'
        } else if (day == 'Viernes') {
            return '5'
        } else if (day == 'Sábado') {
            return '6'
        } else if (day == 'Domingo') {
            return '0'
        }
    }

    verifyDates() {
        if (parseInt(document.getElementById('hour').value) < 0 || parseInt(document.getElementById('hour').value) > 23 || document.getElementById('hour').value == '') {
            return false
        }
        if (parseInt(document.getElementById('minute').value) < 0 || parseInt(document.getElementById('minute').value) > 59 || document.getElementById('hour').value == '') {
            return false
        }
        if (parseInt(document.getElementById('second').value) < 0 || parseInt(document.getElementById('second').value) > 59 || document.getElementById('hour').value == '') {
            return false
        }
        return true;
    }

}


const clock = new Clock;
clock.init();


async function deleteAlarm(id) {
    try {
        const data = await fetch(`/cliente/cajon/${id}`, {
            method: "delete",
        });
        const res = await data.json();

        if (res.estado) {
            window.location.href = `/cliente/cajon/${idCajon}`;
        } else {
            console.log(res);
        }
    } catch (error) {
        console.log(error);
    }
}

let cambioEstado = () => {
    // window.location.href = `/cliente/cajon/${idCajon}`
    estadoAlarma = false
}

btnEliminar.addEventListener('click', async () => {

    const id = formularioAlarmaPreparada.elements['alarm-list-select'].value
    deleteAlarm(alarms[id]._id)
})

btnAlarma.addEventListener('click', async () => {
    //Evita que se procese el formulario
    //e.preventDefault();
    //Constantes del formulario
    let daysArray = []

    let checks = document.querySelectorAll('#formularioAlarma input[type="checkbox"]')
    checks.forEach((e) => {
        if (e.checked == true) {
            daysArray.push(e.value)
        }
    })
    if (daysArray.length == 0) {
        Swal.fire({
            title: `Por favor seleccione algún dia`,
            width: 600,
            padding: '3em',
            color: '#716add',
            imageUrl: 'https://media.tenor.com/KkcihAdnHDQAAAAC/que-miau.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            backdrop: `
            rgba(0,0,123,0.4)
            `
        })
    } else {
        const day = daysArray
        const info = formularioAlarma.elements["info"].value
        const cajon = idCajon
        const usuario = {
            _id: idUsuario,
            usuario: nameUsuario,
        }

        //Si se emplea asyn es recomendable usar un try catch
        try {
            if (clock.verifyDates()) {
                const time = clock.addAlarm()
                const hour = clock.toLocalTimeString(time)
                let horaNueva = true;

                for (i = 0; i < alarms.length; i++) {
                    if (hour == alarms[i].hour) {
                        let alarmaPosible = alarms[i]
                        for (let i = 0; i < daysArray.length; i++) {
                            for(let m = 0; m < alarmaPosible.day.length; m++){
                                if (daysArray[i] == alarmaPosible.day[m]) {
                                    horaNueva = false
                                }
                            }
                           
                        }
                    }
                }

                if (horaNueva) {
                    //Enviamos el body, ya que no lo hacemos mediante el form
                    const data = await fetch('/cliente/cajon', {
                        method: 'post',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ hour, day, info, cajon, usuario }),
                    })
                    //Recibimos la respuesta para procesarla
                    const res = await data.json()

                    if (res.estado) {
                        window.location.href = `/cliente/cajon/${idCajon}`
                    } else {
                        console.log(res);
                    }
                }else[
                    Swal.fire({
                        title: `Esa hora ya fue asignada`,
                        width: 600,
                        padding: '3em',
                        color: '#716add',
                        imageUrl: 'https://media.tenor.com/KkcihAdnHDQAAAAC/que-miau.gif',
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        backdrop: `
                        rgba(0,0,123,0.4)
                        `
                    })
                ]

            } else {
                Swal.fire({
                    title: `Por favor digite una hora válida`,
                    width: 600,
                    padding: '3em',
                    color: '#716add',
                    imageUrl: 'https://media.tenor.com/KkcihAdnHDQAAAAC/que-miau.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    backdrop: `
                    rgba(0,0,123,0.4)
                    `
                })
            }


        } catch (error) {
            console.log(error)
        }
    }
})


// formularioAlarma.addEventListener('submit', async (e) => {
//     //Evita que se procese el formulario
//     e.preventDefault();

//     //Si se emplea asyn es recomendable usar un try catch
//     try {
//         if (clock.verifyDates) {
//             formularioAlarma.action
//             formularioAlarma.submit()
//         }
//         clock.addAlarm();

//     } catch (error) {
//         console.log(error)
//     }
// })