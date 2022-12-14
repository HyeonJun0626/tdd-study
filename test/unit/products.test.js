// describe('calculation', () => {
//
//     test('two plus two is four', () => {
//         expect(2+2).toBe(4);
//     });
//
//     test('two plus two is not five', () => {
//         expect(2+2).not.toBe(5);
//     });
// });

const productController = require('../../controller/products');
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http'); // req, res 객체 mocking
const newProduct = require('../data/new_product.json');
const allProducts = require('../data/all_product.json');

productModel.create = jest.fn(); // Mocking
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "51gddaswersddfs";
const updatedProduct = { name: 'update name', description: 'updated description' };
let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Product Controller Create', () => {

    beforeEach(() => {
        req.body = newProduct;
    });

    // toBe()            : 단순 값 비교
    // toBeCalled()      : 함수가 호출 되었는지 여부
    // toBeCalledTimes() : 함수가 몇번 호출되었는지 검증
    // toBeCalledWith()  : 함수가 설정한 인자로 호출 되었는지 검증
    // toBeTruthy()      : 검증 대상이 true 인지, 문자열이 있어도 true 로 간주
    // toBeFalsy()       : 검증 대상이 false 인지

    it('상품 생성 컨트롤러 있냐', () => {
        expect(typeof productController.createProduct).toBe('function');
    });

    it('상품 생성 컨트롤러 호출될 때 Model.create 함수 불러지냐', async () => {
        await productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(newProduct);
    });

    it('상품 생성 후 201 res 잘되냐', async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('리턴 값이 맞냐', async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });
    it('에러 res 똑바로 가냐', async () => {
        const errorMessage = { message: 'description can not be null' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});


describe('Product Controller Get', () => {
    it('상품 find 컨트롤러 있냐', () => {
        expect(typeof productController.getProducts).toBe('function');
    });
    it('상품 생성 컨트롤러 호출될 때 Model.find 함수 불러지냐', async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({})
    });
    it('200 return 잘되냐', async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });
    it('json result return 잘되냐', async () => {
        productModel.find.mockReturnValue(allProducts)
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });
    it('에러 처리 잘되냐', async () => {
        const errorMessage = { message: 'Find Error' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Product Controller Get By Id', () => {
    it('상품 단건 find 컨트롤러 있냐', () => {
        expect(typeof productController.getProductById).toBe('function');
    });
    it('상품 생성 컨트롤러 호출될 때 Model.findById 함수 불러지냐', async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });
    it('200 return 잘되냐', async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('값 없을때 404 return', async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });
    it('error handle', async () => {
        const errorMessage = { message: 'error' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Product Controller Update', () => {
    it('update 컨트롤러 있냐', () => {
        expect(typeof productController.updateProduct).toBe('function');
    });
    it('update 컨트롤러 호출될 때 Model.findByIdAndUpdate 함수 불러지냐', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId,
            { name: 'update name', description: 'updated description' },
            { new: true },
        );
    });
    it('200 return 잘되냐', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    it('404 return 잘되냐', async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    });

    it('error handle', async () => {
        const errorMessage = { message: 'Error' };
        const rejectPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('Product Controller Delete', () => {
    it('delete 컨트롤러 있냐', () => {
        expect(typeof productController.deleteProduct).toBe('function');
    });
    it('update 컨트롤러 호출될 때 Model.findByIdAndDelete 함수 불러지냐', async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    });
    it('200 return 잘되냐', async () => {
        let deletedProduct = {
            name: 'deletedProduct',
            description: 'it is deleted'
        }
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled).toBeTruthy();
    });
    it('404 return 잘되냐', async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('error handle', async () => {
        const errorMessage = { message: 'Error' };
        const rejectPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});
