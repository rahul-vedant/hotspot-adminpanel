import React, { useEffect, useState } from 'react';
import { useHistory, useParams ,useLocation} from 'react-router-dom';
import { uploadImage } from '../../../../../api';
import { useSelector } from 'react-redux';
import Loader from '../../../../../globalComponent/layout/loader';


const AddOnsForm = (props) => {
	const history = useHistory();
	const token = useSelector((state) => state.auth.isSignedIn);
	const { id } = useParams();

	const { pathname } = useLocation();
	let path = pathname.split('/')[1];
	let menuId = pathname.split('/')[2];

	const [imageLoader, setImageLoader] = useState(false);

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			width: '100%',
			backgroundColor: '#fafafa',
			borderColor: 'grey',
		}),
	};

	const handleImageChange = (e) => {
		if(e.target.files[0])
		{
			var imageArray = e.target.files[0].name.split('.');
			if(imageArray.length > 2  && imageArray.length < 2 )
			{
				props.setError("Double extension files are not allowed.");
			}else if(imageArray[1] !== "jpeg" && imageArray[1] !== "jpg" && imageArray[1] !== "png" ){
				props.setError("Only jpeg, jpg or png images are allowed.");
			}else{
				let data = {
					image: e.target.files[0],
					folderName: 'dish',
				};
				setImageLoader(true);
				uploadImage(token, data)
					.then((res) => {
						let updatedDish = { ...dish };
						updatedDish.image_url = res.image_url;
						props.setDish(updatedDish);
						setImageLoader(false);
						props.setError("");
					})
					.catch((error) => {
						setImageLoader(false);
						props.setError(error);
					});
			}
		}
	};
	let dish = props.dish;

	const handleDishChange = (e) => {
			if(e.target.id === "price" && e.target.value === "0")
			{
				props.setError("Price should be greater than zero.");
			}
			else{
				let updatedDish = { ...dish };
				updatedDish[e.target.id] = e.target.value;
				props.setDish(updatedDish);
				props.setError("");
			}
	};
	return (
		<>
			<div
				className='main-content pb-16 md:pb-5 flex-1 pt-20 px-2'
				style={{ overflowY: 'scroll', height: '100vh' }}>
				<div className='p-4 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white w-3/4 mx-auto'>
					<h3 className='text-lg font-bold mb-4'>{props.title}</h3>

					<button
						style={{ height: '3rem' }}
						onClick={() => history.push({
							pathname:`/${'viewRestaurant'}/${window.localStorage.getItem('menuId')}/viewDish/${window.localStorage.getItem('dishId')}/addOns`,
							state: { menuId: menuId, previousPath:path}
							})
							}
						className='shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
						type='button'>
						Back
					</button>

					<button
						style={{ height: '3rem' }}
						form='myForm'
						type='submit'
						className='shadow bg-red-500 ml-3 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>
						Save
					</button>
					{props.error && (
						<p
							style={{
								color: 'red',
								fontSize: '20px',
								textAlign: 'center',
								width: '100%',
							}}>
							{props.error}
						</p>
					)}
					{props.successMsg && (
						<div
							style={{
								backgroundColor: '#9ACD32',
								padding: '10px',
								width: 'fit-content',
								marginLeft: 'auto',
								marginRight: 'auto',
								marginTop: '12px',
							}}>
							{props.successMsg}
						</div>
					)}
					{props.loading || !dish ? (
						<Loader />
					) : (
						<form
							id='myForm'
							onSubmit={props.handleDishes}
							className='w-full mt-6 max-w-full text-base text-gray-200'>
							<div className='flex flex-wrap -mx-3 mb-3'>
								<div className='w-full  px-3 mb-3 md:mb-0'>
									<label
										className='block tracking-wide mb-2 text-gray-300'
										htmlFor='name'>
										Name
									</label>
									<input
										className='appearance-none block w-full bg-gray-100 bg-100 border rounded-half py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-200'
										id='name'
										type='text'
										onChange={handleDishChange}
										value={dish.name}
									/>
								</div>
								<div className='w-full  px-3 mb-3 md:mb-0'>
									<label
										className='block tracking-wide mb-2 text-gray-300'
										htmlFor='price'>
										Price
									</label>
									<input
										className='appearance-none block w-full bg-gray-100 border border-100 rounded-half py-3 px-6 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-200'
										id='price'
										onChange={handleDishChange}
										type='price'
										value={dish.price}
									/>
								</div>
							</div>
							<div className='flex flex-wrap -mx-3 mb-3'>								
								<div className='w-full mt-3 px-3 mb-2  md:mb-0'>
									<label className='block tracking-wide mb-2 text-gray-300'>
										Images
									</label>
									{imageLoader ? (
										<label
											className='block tracking-wide  mb-2 text-gray-300  w-1/2'
											htmlFor='images'>
											<div
												style={{
													minHeight: '200px',
													minWidth: '100%',
													backgroundColor: 'lightgray',
													textAlign: 'center',
													lineHeight: '190px',
												}}>
												Loading..........
											</div>
										</label>
									) : (
										<>
											<label
												className='block tracking-wide  mb-2 text-gray-300  w-1/2'
												htmlFor='images'>
												{dish.image_url ? (
													<img
														style={{
															minHeight: '200px',
															minWidth: '100%',
															backgroundColor: 'lightgray',
															textAlign: 'center',
														}}
														src={dish.image_url}
													/>
												) : (
													<div
														style={{
															minHeight: '200px',
															minWidth: '100%',
															backgroundColor: 'lightgray',
															textAlign: 'center',
															lineHeight: '190px',
														}}>
														{' '}
														Upload Dish Image
													</div>
												)}
											</label>
											<input
												type='file'
												onChange={handleImageChange}
												id='images'
												style={{ display: 'none' }}
											/>
										</>
									)}
								</div>
							</div>
						</form>
					)}
				</div>
			</div>
		</>
	);
};
export default AddOnsForm;
