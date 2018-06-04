var Category = require('../../../models/categories')
var renderCategories = (res, categories, selectedCategory = null,parentCategories,pagination=undefined,curPage=1) => {

    var newCategories = categories.map(async (cat) => {
        try {
            parentCats = await Category.findOne({ _id: cat.parent });
            parentCats = parentCats.name;
        } catch (err) {
            parentCats = "None";
        }
        var newCat = JSON.parse(JSON.stringify(cat));

        newCat.pName = parentCats;

        return newCat;
    });

    Promise.all(newCategories).then((cats) => {
        res.render("admin/createCategory", {
            layout: 'admin',
            categories: cats,
            selectedCategory: selectedCategory,
            parentCategories: parentCategories,
            pagination: pagination,
            curPage: curPage
        })
    });
};

module.exports={
    renderCategories,
}