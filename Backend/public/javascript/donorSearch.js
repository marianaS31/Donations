const Donor = require('../../schemas/donors');

class DonorSearch {

    static async searchByEmail(email) {
        try {
            const searchResults = await Donor.find({ email: { $regex: email, $options: 'i' } });
            return searchResults;
        } catch (error) {
            console.error('Error searching donors by email:', error);
            throw new Error('Internal server error');
        }
    }
    


    
}

module.exports = DonorSearch;
