export default {

    getProductsToHome : () => {
        return fetch('/customer/')
            .then(response => {
                if (response.status !== 401) {
                    return response.json().then(data => data);
                }
                else
                    return { message: { msgBody: "UnAuthorized", msgError: true } };
            });
    },

    getProductsToCart : () => {
        return fetch('/customer/cart')
            .then(response => {
                if (response.status !== 401) {
                    return response.json().then(data => data);
                }
                else
                    return { message: { msgBody: "UnAuthorized", msgError: true } };
            });
    },

    addToCart: (item) => {
        const obj = {item : item};
        return fetch('/customer/', {
            method: "post",
            body: JSON.stringify(obj),
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

    updateCart: (item) => {
        const obj = {item:item};
        return fetch('/customer/cart', {
            method: "post",
            body: JSON.stringify(obj),
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

}