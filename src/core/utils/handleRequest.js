export async function handleRequest(serviceFunction, params, res) {
    try {
        const result = await serviceFunction(...params);
        res.json(result);
    } catch (error) {
        console.log("ERROR" + error);
        res.status(500).json({ message: error.message });
    }
}