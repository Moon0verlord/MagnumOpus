export const useUtils = () => {
    const sayHello = () => {
        console.log("hello from useUtils")
    }
    
    return {
        sayHello,
    };
}