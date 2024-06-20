const lodash = require('lodash')
const validator = require('validator')
const mongoose = require('mongoose')

// pour commenter une fonction => / */ (à coller sur la fonction)

/** 
 * @description validation de la création d'une nouvelle équipe
 *@param {object} data les champs du formulaire
 *@param {*} Team On récupère le schéma
 *@returns {object} erreurs du formulaire
*/

module.exports = async (data, Team) => {
    const errors = {}
    // vérifie que la valeur existe (que sur les champs requis)
    data.name = lodash.isEmpty(data.name) ? '' : data.name

    // envoie un message d'erreur si la condition (name = vide) est validé
    if (validator.isEmpty(data.name)) {
        errors.name = 'Il y a une erreur'
    } else {
        //1) chercher dans la base de données si il y a un élément qui correspont à name
        //2) si il y a un élément on assigne une erreur
        const dataName = await Team.findOne({ name: data.name })
        if (dataName) {
            errors.name = 'Le nom doit être unique'
        }
    }

    return errors
}