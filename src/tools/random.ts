export default function randomString(length? : number){
    let result = "";
    const Characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let i=0 ; i < (length?length:4) ; i++){
        result += Characters[Math.floor(Math.random()*Characters.length)]
    }
    return result
}