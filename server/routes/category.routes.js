const express=require('express')
const router=express.Router();

router.get('/', getCategories)
router.post('/', addCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports=router