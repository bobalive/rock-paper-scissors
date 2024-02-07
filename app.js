const prompt = require('prompt-sync')();
const crypto = require('crypto');
const Table = require('cli-table');




class Game {
    constructor(data){
        if(data.length <=2){
            console.log('enter arguments');
            return
        }

        this.length = data.length-2
        this.data = data.slice(2)

        this.table = new GenTable(this.data)
        this.chechWinner = new ChechWinner(this.data).chechWinner

        this.pMove = ''
        this.pMoveIndex = ''
        this.cMove = ''
        this.cMoveIndex = ''

        

        this.unique = this.isUnique()

        this.key = new Key().createKey()

        

        this.compMove()
        this.hmac =  new Hmac(this.key).createHmac(this.cMove)

        
        if(this.length%2 ===0 || data.length == 3){
            console.log('there should be odd argumensts and more than 1');
            return
        }
        if(this.unique){
            console.log('there should be unique argemunts');
            return
        }

        this.showMenu()
        this.playerMove()
        console.log(this.chechWinner(this.cMove,this.pMove)); 

        console.log(`hmac key: ${this.key}` );



    }

    showMenu(){
        console.log('hmac: '+ this.hmac);

        console.log('Availabale moves:');
        for(let i =1 ;i <= this.data.length; i++){
            console.log(`${i} - ${this.data[i-1]}`)
        }

        console.log('0 - exit');
        console.log('? - help')
    }

    isUnique(){
        return this.data.some(unique =>{
            return this.data.filter(item => item === unique).length>1
        })

    }
    createHmac(message){
        let hmac = crypto.createHmac('sha3-256',this.key)
        hmac.update(message)
        return hmac.digest('hex')
    }
    compMove(){
        let move = Math.round(Math.random()*(this.data.length-1))
        this.cMove = this.data[move] 
    }
    playerMove(){
        let move = ''
        
        while(!(move >= 0 && move <= this.data.length) || move == ''){
            move = prompt('Enter your move: ')
            switch (move){
                case '0':
                    process.exit()
                case '?':
                    this.table.showTable()
                    break
                default:
                    break
            }
            
            

            if(move >0 && move <=this.data.length){
                this.pMove = this.data[move-1]
                
                console.log(`Your move ${this.pMove}`);
                console.log(`Computer move ${this.cMove}`);
            }
        }


        
    }


    
}


class GenTable{
    constructor(data){
        this.data = data
        this.chechWinner = new ChechWinner(this.data).chechWinner
    }
    showTable(){
        const table = new Table({
            head: ['v PC\ User >'].concat(this.data)
        })
        for(let i = 0; i < this.data.length ; i++){
            let res  = [this.data[i]]

            for(let j = 0 ;j < this.data.length ; j++){
                res.push(this.chechWinner(this.data[i],this.data[j]))
            }

            table.push(res)
        }

        console.log(table.toString());
    }
    }

class ChechWinner{
    constructor({data}){
        this.data= data

    }
    chechWinner(compMove , playerMove){
        let pMoveIndex = this.data.indexOf(playerMove)
        let cMoveIndex = this.data.indexOf(compMove)
        if((pMoveIndex - cMoveIndex <=Math.floor(this.data.length/2) && pMoveIndex > cMoveIndex) || pMoveIndex - cMoveIndex < -Math.floor(this.data.length/2)){
            return `You win!`
        }else if(pMoveIndex === cMoveIndex ){
            return 'Draw'
        }else{
            return 'Computer wins! :('
        }
    }  

}

class Key {
    createKey(){
        return  crypto.randomBytes(32).toString('hex');
    }

}
class Hmac{
    constructor(key){
        this.key = key
    }
    createHmac(message){
        let hmac = crypto.createHmac('sha3-256',this.key)
        hmac.update(message)
        return hmac.digest('hex')
    }
}


const game = new Game(process.argv)