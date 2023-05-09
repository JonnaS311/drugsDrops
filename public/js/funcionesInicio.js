const alarmaLista = document.querySelector('#titulo-inicio')
//Constante que busca la información en el ejs
const alarmString = alarmaLista.dataset.info;
const tituloCajon = document.querySelector('#titulo-inicio')
const idCajon = tituloCajon.dataset.cajon
//Pasar de String a Array
let alarms = JSON.parse(alarmString)
let diaFecha = ""
let estadoAlarma = false
let segundosRestantes = 0;
console.log(alarms)


class Clock {
    locale = 'es-ES'
    init() {

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
        document.getElementById('second').value = "0";
        document.getElementById('hour').focus();
    }

    addAlarm = () => {
        const date = new Date;
        date.setHours(document.getElementById('hour').value)
        date.setMinutes(document.getElementById('minute').value)
        date.setSeconds(document.getElementById('second').value)
        return date
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


let cambioEstado = () => {
    // window.location.href = `/cliente/home`
    cambioEstado = false
}

