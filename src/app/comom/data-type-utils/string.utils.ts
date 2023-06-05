export class stringUtils{
    public static isnullOrEmty(val: string) : boolean{
        if(val === undefined || val === null || val.trim() === ''){
            return true;
        }
        return false;
    }
}