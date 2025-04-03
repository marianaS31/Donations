const Admin = require('../../schemas/admins');

class adminSearch{
    static async searchByEmail(email) {
        try {
            const searchResults = await Admin.find({ email: { $regex: email, $options: 'i' } });
            return searchResults;
        } catch (error) {
            console.error('Error searching admins by email:', error);
            throw new Error('Internal server error');
        }
    }
    

}
module.exports= adminSearch;