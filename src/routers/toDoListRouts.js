const express = require('express')
const ToDoList = require('../models/ToDoList')
const router = new express.Router()


//Endpoint post for posting Tasks
router.post('/todos', async (req,res)=>{
    const todo = new ToDoList(req.body)
    try{
        await todo.save()
        res.status(201).send(todo)
    }catch(e){
        res.status(400).send(e)
    }
})

//Endpoint for reading all Tasks
router.get('/todos',async(req,res)=>{
    try{
        const tasks = await ToDoList.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

//Endpoint for reading Tasks of TaskToDo by type
router.get('/todos/tasktodo',async(req,res)=>{
    try{
        const task = await ToDoList.find({typeOfCard:'TaskToDo'})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
}) 
//Endpoint for reading Tasks of TaskDone by type
router.get('/todos/taskdone',async(req,res)=>{
    try{
        const task = await ToDoList.find({typeOfCard:'TaskDone'})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
//Endpoint for reading Task of TaskDeleted by type
router.get('/todos/taskdeleted', async(req,res)=>{    
    try{
        const task = await ToDoList.find({typeOfCard:'TaskDeleted'})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
//Endpoint for reading any Task by id 
router.get('/todos/tasks/:id',async(req,res)=>{
    const _id =  req.params.id
    try{
        const task = await ToDoList.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
//Endpoint for updating TypeOfCard-from ToDoTask to DoneTask
router.patch('/todos/taskstodotasktodonetask/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await ToDoList.findByIdAndUpdate(_id,{typeOfCard:'TaskDone'},{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
//Endpoint for updating TypeOfCard-from DoneTask to TaskDeleted
router.patch('/todos/tasksdonetotaskdelete/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await ToDoList.findByIdAndUpdate(_id,{typeOfCard:'TaskDeleted'},{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})
//Endpoint for updating TypeOfCard-from DoneTask to ToDoTask
router.patch('/todos/taskdonetotask/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await ToDoList.findByIdAndUpdate(_id,{typeOfCard:'TaskToDo'},{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})
//Endpoint for updating TypeOfCard-from TaskDeleted to DoneTask
router.patch('/todos/taskdeletedtotaskdone/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await ToDoList.findByIdAndUpdate(_id,{typeOfCard:'TaskDone'},{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})
//Endpoint for deleting from Tasks by Id
router.delete('/todos/:id',async(req,res)=>{
     const _id = req.params.id
     try{
        const task = await ToDoList.findByIdAndDelete(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
     }catch(e){
         res.status(400).send()
     }
})

module.exports = router