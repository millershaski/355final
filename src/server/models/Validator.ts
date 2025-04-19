

let didFail_: boolean = false;
let allFailMessages_: string[] = [];



// if null is returned, then the validate passed. If anything else is returned, it's assumed to be an error message
export type ValidateCallback = (obj: any) => string | null;

export const Validator = 
{
    // Invoke this method to clear all validation
    Reset()
    {
        didFail_ = false;
        allFailMessages_ = [];
    },



    IsValid(): boolean
    {
        if(allFailMessages_ == null)
            return true;

        return allFailMessages_.length == 0;
    },


    
    GetAllErrorMessages(): string[]
    {
        return allFailMessages_;
    },



    Validate(obj: any, label: string, ...allCallbacks: ValidateCallback[])
    {
        if(obj == null)
            allFailMessages_.push(label + " is null or undefined");

        allCallbacks.forEach((callback) => 
        {
            let errorMessage = callback(obj); 
            if(errorMessage)
                allFailMessages_.push(label + " " + errorMessage);
        });
    },



    NotEmptyString(obj: any): string | null
    {
        if((typeof obj === "string") == false)
            return "is not of type 'string'"

        const asString = String(obj);
        if(asString == null) // can the cast fail since we already checked the type?
            return "is not of type 'string'"

        if(asString.length == 0)
            return "is empty";

        return null;
    },



    ValidateDate(obj: any): string | null
    {
        const asDate = new Date(obj);
        if(asDate == null)
            return "is not a valid date"

        return null;
    },

    

    // note that this does not check if obj is an integer
    ValidateNonZeroPositiveNumber(obj: any): string | null
    {
        if((typeof obj === "number") == false)
            return "is not a number";

        if(obj <= 0)
            return "is less than or equal to 0"; 

        return null;
    }
};