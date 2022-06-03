const { response } = require('express');
const Medico = require('../models/medico');


const getMedicos = async(req, res = response ) => {

    const medicos = await Medico.find()
                            .populate('usuario', 'nombre email img')
                            .populate('hospital', 'nombre');                              

    res.json({
        ok: true,
        medicos: medicos
    })
}

const getMedicosById = async(req, res = response ) => {


    try {
        const id = req.params.id
    
        const medico = await Medico.findById( id ) 
                                .populate('usuario', 'nombre email img')
                                .populate('hospital', 'nombre');                              
    
        res.json({
            ok: true,
            medico: medico
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            medico: 'Hable con el administrador'
        })
        
    }
}

const crearMedico = async(req, res = response ) => {

    const uid = req.uid;
    
    const medico = new Medico({ 
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            msg: 'crearMedico',
            medico: medicoDB 
        })


    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const actualizarMedico = async (req, res = response ) => {

    const id =  req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById( id );
        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe medico con ese id'
            });    
        }

        const cambiosMedico = {
             ...req.body,
            usuario: uid,
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } );


         
        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado
        })
    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const borrarMedico = async (req, res = response ) => {

    const id =  req.params.id;
    
    try {

        const medico = await Medico.findById( id );
        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe Medico con ese id'
            });    
        }

        await Medico.findByIdAndDelete( id );
         
        res.json({
            ok: true,
            msg: 'Médico eliminado'
        })
    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,    
    actualizarMedico,    
    borrarMedico,
    getMedicosById
}