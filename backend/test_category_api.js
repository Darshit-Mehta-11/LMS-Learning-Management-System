const axios = require('axios');

const testApi = async () => {
    try {
        // First get categories to get a valid ID
        const catRes = await axios.get('http://localhost:5000/api/v1/course/showAllCategories');
        const categories = catRes.data.data;
        console.log(`Found ${categories.length} categories.`);

        for (const cat of categories) {
            console.log(`\nTesting Category: ${cat.name} (${cat._id})`);
            try {
                const pageRes = await axios.post('http://localhost:5000/api/v1/course/getCategoryPageDetails', {
                    categoryId: cat._id
                });
                console.log(`  Success: ${pageRes.data.success}`);
                if (pageRes.data.data.selectedCategory) {
                    console.log(`  Selected Category Courses: ${pageRes.data.data.selectedCategory.courses.length}`);
                } else {
                    console.log(`  Selected Category is NULL`);
                }
            } catch (err) {
                console.log(`  Error: ${err.response?.status} - ${err.response?.data?.message}`);
            }
        }
    } catch (error) {
        console.error("Test failed:", error.message);
    }
};

testApi();
