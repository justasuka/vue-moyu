export default {
    multiplechoice(that){
        let name=that.$options.name
        let arr=["sysnetConsumptionReport","sysnetMeterReading","sysPeakPinggunet","sysnetConsumptionComparison"]
        let N= arr.indexOf(name)
        if(N=='-1'){
            return false
        }else {
            return true
        }
    },
}