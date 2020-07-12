export const  DateTimeFormatUtil={
    methods:{
        getDurationTime(time){

            //let time = row.stateTime*60*1000;
            let days    = time / 1000 / 60 / 60 / 24;
            let daysRound = Math.floor(days);
            let hours = time / 1000 / 60 / 60 - (24 * daysRound);
            let hoursRound = Math.floor(hours);
            let minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
            let minutesRound = Math.floor(minutes);
            let seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
            return daysRound + '天'+hoursRound + '时'+minutesRound + '分';
        }
    }
}