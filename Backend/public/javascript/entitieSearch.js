const Entitie = require('../../schemas/entities');

class EntitieSearch {

    static async searchByName(name) {
        try {
            const searchResults = await Entitie.find({ name: { $regex: name, $options: 'i' } });
            return searchResults;
        } catch (error) {
            console.error('Error searching entities by name:', error);
            throw new Error('Internal server error');
        }
    }
    

    static async searchByEmail(email) {
        try {
            const searchResults = await Entitie.find({email: { $regex: email, $options: 'i' } });
            return searchResults;
        } catch (error) {
            console.error('Error searching entities by email:', error);
            throw new Error('Internal server error');
        }
    }


}
    


module.exports = EntitieSearch;
