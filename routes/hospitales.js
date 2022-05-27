/*
    Hospitales
    Rutas: '/api/hospitales'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');
const {getHospitales, crearHospital, actualizarHospital, borrarHospital} = require('../controllers/hospitales');



const router = Router();

router.get('/', getHospitales );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesaario').not().isEmpty(),
    validarCampos
], crearHospital );

router.put('/:uid', [ 
    
], actualizarHospital );

router.delete('/:uid',
     borrarHospital 
);

module.exports = router;






