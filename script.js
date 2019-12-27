var customerType=document.getElementById('customerType'),
    repaymentType=document.getElementById('repaymentType'),
    propertyValue= document.getElementById('propertyValue'),
    depositAmount= document.getElementById('depositAmount'),
    netPropertyValue= document.getElementById('netPropertyValue'),
    mortgageTerm= document.getElementById('mortgageTerm'),
    MortgageTermMonths= document.getElementById('MortgageTermMonths'),
    periodPerYear= document.getElementById('periodPerYear'),
    initInterestRate= document.getElementById('initInterestRate'),
    monthlyPayment= document.getElementById('monthlyPayment'),
    totalMortgage= document.getElementById('totalMortgage'),
    LTV= document.getElementById('LTV'),
    totalMortgageInterest= document.getElementById('totalMortgageInterest');




customerType.addEventListener('change',monthlyPaymentCalculator);
repaymentType.addEventListener('change',monthlyPaymentCalculator);
propertyValue.addEventListener('change',monthlyPaymentCalculator);
depositAmount.addEventListener('change',monthlyPaymentCalculator);
netPropertyValue.addEventListener('change',monthlyPaymentCalculator);
mortgageTerm.addEventListener('change',monthlyPaymentCalculator);
MortgageTermMonths.addEventListener('change',monthlyPaymentCalculator);
initInterestRate.addEventListener('change',monthlyPaymentCalculator);



propertyValue.addEventListener('change',netPropertyValueCalculator);
depositAmount.addEventListener('change',netPropertyValueCalculator);



propertyValue.addEventListener('change',totalMortgageInterestCalc);
depositAmount.addEventListener('change',totalMortgageInterestCalc);


function netPropertyValueCalculator(){
    var pValue=Number(propertyValue.value),
        dAmount=Number(depositAmount.value);
    netPropertyValue.value=pValue-dAmount;
}


mortgageTerm.onchange=function () {

    MortgageTermMonths.value=Number(mortgageTerm.value)*12;

    totalMortgageSetter();
};



function monthlyPaymentCalculator() {
    
    if( customerType.value === "I am first time buyer" && repaymentType.value === "Repayment"){
        monthlyPayment.value = PMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),MortgageTermMonths.value, -propertyValue.value);
    }else{
        if(customerType.value === "I am remortgaging" && repaymentType.value === "Repayment"){
            monthlyPayment.value = PMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),MortgageTermMonths.value, -propertyValue.value);
        }else{
            if(customerType.value === "I am remortgaging" && repaymentType.value === "Interest Only"){
                var pmt= PMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),MortgageTermMonths.value, -propertyValue.value);
                monthlyPayment.value = IPMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),1, - propertyValue.value,pmt)
            }else {
                if(customerType.value === "I am moving house" && repaymentType.value === "Repayment"){
                    monthlyPayment.value = PMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),MortgageTermMonths.value, -netPropertyValue.value);
                }else{
                    if(customerType.value === "I am moving house" && repaymentType.value === "Interest Only"){
                        var pmt= PMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),MortgageTermMonths.value, -netPropertyValue.value);
                        monthlyPayment.value = IPMT(((Number(initInterestRate.value)/100) / Number(periodPerYear.value)),1, - netPropertyValue.value,pmt)
                    }else{
                        monthlyPayment.value = 0;
                    }
                }
            }
        }
    }


    totalMortgageSetter();
}


/**
 * @return {number}
 */
function PMT(ir, np, pv, fv, type) {

    ir=Number(ir);
    np=Number(np);
    pv=Number(pv);
    fv=Number(fv);
    type=Number(type);

    if(!fv) fv=0;

    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * pv * (pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt.toFixed(2);
}


/**
 * @return {number}
 */
function IPMT( rate, per, pv, pmt) {

    pv=Number(pv);
    pmt=Number(pmt);
    rate=Number(rate);
    per=Number(per);

    var tmp = Math.pow(1 + rate, per);
    return (0 - (pv * tmp * rate + pmt * (tmp - 1))).toFixed(2);
}




function totalMortgageSetter() {
    var mPayment=Number(monthlyPayment.value);
    var mMonths=Number(MortgageTermMonths.value);
    totalMortgage.value=mPayment*mMonths;
    LTVCalc();
}


function LTVCalc() {


    var tMortgage=Number(totalMortgage.value);
    var nValue=Number(netPropertyValue.value);

    LTV.value=((tMortgage/nValue)*100).toFixed(2);

    totalMortgageInterestCalc();
}




function totalMortgageInterestCalc() {

    if(repaymentType.value==="Interest Only" && customerType.value==="I am moving house"){
        totalMortgageInterest.value= (Number(totalMortgage.value)+Number(netPropertyValue.value)).toFixed(2);
    }else{
        if(repaymentType.value==="Interest Only"){
            totalMortgageInterest.value = (Number(totalMortgage.value)+Number(propertyValue.value)).toFixed(2);
        }else{
            totalMortgageInterest.value=  0;
        }
    }
}



monthlyPaymentCalculator();