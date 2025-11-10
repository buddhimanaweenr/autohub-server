export default function validate (JoiSchema, data) {
    
    const { error } = JoiSchema.validate(data, options);

    // return error

    if (error) {

        return mapError(error)

    }

    return false

}

export const validateAsync = async (JoiSchema, data, opt={}) => {

    try{

        await JoiSchema.validateAsync(data, options);

    } catch (error) {

        return mapError(error)

    }

    return false

}

const options = {
    abortEarly: false,
    errors:{
        escapeHtml: false,
        label: false,
    }
}


const mapError = (error) => {

    // console.log(error)

    const errList = error.details;

    let newErrList = {}

    errList.map((err) => {

        const label = err.context.label
        const key = err.context.key
        const value = err.context.value
        const msg = err.message

        
        newErrList[key] = msg

    })

    return newErrList

}