export default {

    getProducts: () => {
        return fetch('/admin/admin')
            .then(response => {
                if (response.status !== 401) {
                    return response.json().then(data => data);
                }
                else
                    return { message: { msgBody: "UnAuthorized", msgError: true } };
            });
    },

    addProduct: (product) => {
        return fetch('/admin/addProduct', {
            method: "post",
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data);
            }
            else
                return { message: { msgBody: "UnAuthorized", msgError: true } };
        });
    },

    getEditProduct: (productId) => {
        console.log("inside admin pro id ",productId);
        const proId = {productId : productId};
        return fetch('/admin/getEditProduct', {
            method: "post",
            body: JSON.stringify(proId),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data);
            }
            else
                return { message: { msgBody: "UnAuthorized", msgError: true } };
        });
    },

    updateEditProduct: (formData) => {
        return fetch('/admin/updateEditProduct/' + formData.get('productId'), {
            method: "post",
            body: formData,
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data);
            }
            else
                return { message: { msgBody: "UnAuthorized", msgError: true } };
        });
    },

    deleteProduct: (productId) => {
        const proId = {productId : productId};
        return fetch('/admin/deleteProduct', {
            method: "post",
            body: JSON.stringify(proId),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data);
            }
            else
                return { message: { msgBody: "UnAuthorized", msgError: true } };
        });
    }

}