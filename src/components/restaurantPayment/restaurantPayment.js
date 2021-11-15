/**
 * The file is covered under Algoworks Work Product License for Design & Development of Mobile Application for “Hotspot”.
 * Please review the license for full details.
 * This program is not free software: You cannot redistribute it for any use under the terms of the Algoworks Work Product License for Design & Development of Mobile Application for “Hotspot”.
 * However the source can be modified and updated for the working of the application Design & Development of Mobile Application for “Hotspot” for which it was licensed.
*/

import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import Pagination from 'react-js-pagination';
import SearchComponent from '../searchComponent/index';
import { getRestaurantEarningList,generateRestaurantEarnings,generateRestaurantOrderEmail } from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {formatDate, formatTime } from '../../utils/redableDateTime';
import { clearData } from '../../actions';
import moment from 'moment';


const RestaurantPayment = () => {
	const token = useSelector((state) => state.auth.isSignedIn);

	const dispatch = useDispatch();
	const history = useHistory();

	const val = useSelector((state) => state.auth.searchText);
	let searchText = val ? val : '';

	const startval = useSelector((state) => state.auth.startDate);
	let startDate = startval ? startval : '';

	const endval = useSelector((state) => state.auth.endDate);
	let endDate = endval ? endval : '';

	const res = useSelector((state) => state.auth.filterBy);
	let filterby = res ? res.value : '';

	const [error, setError] = useState(null);

	const [restaurantPayment, setRestaurantPayment] = useState([]);
	const [startId, setStartId] = useState(0);
	let endId = startId < 0 ? 0 : startId + restaurantPayment.length;
	let currentId = startId;

	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState(10);
	const [totalItems, setTotalItems] = useState(null);
	const [activePage, setCurrentPage] = useState(1);


	const [selectedRestaurant, setSelectedRestaurant] = useState({
		startDate: null,
		endDate: null,
		restaurantPaymentId: null,
	});

	let clearSearchAndFilter = () => {
		searchText = "";
		startDate = "";
		endDate = "";
		filterby = "";
	}

	const columns = [
		{
			Header: '#',
			width: 30,
			id: 1,
			className: 'text-center view-details',
			accessor: (item) => {
				currentId++;
				return (
					<>
						<div className='flex items-center' style={{ cursor: 'pointer' }}>
							<div className='text-sm'>
								<p className='text-gray-300 leading-none'>{currentId}</p>
							</div>
						</div>
					</>
				);
			},
		},
		{
			id: 2,
			Header: 'Payment Id',
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer', color: '#39B7CD' }}>
						<p
							onClick={() => {
								let updatedData = { ...selectedRestaurant };
								updatedData['startDate'] = item.from_date;
								updatedData['endDate'] = item.to_date;
								updatedData['restaurantPaymentId'] = item.payment_id;
								setSelectedRestaurant(updatedData);
								
									history.push({
										pathname: `/restaurantPayment/${item.payment_id}`,
										state: {
											data: updatedData,
											paymentDetails: item.payment_details,
										},
									});
								
							}}>
							{item.payment_id}
						</p>
					</div>
				);
			},
		},
		{
			id: 3,
			Header: 'Restaurant Name',
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer' }}>
						{item.restaurant_name}
					</div>
				);
			},
		},
		// {
		// 	id: 4,
		// 	Header: 'Created Date',
		// 	className: 'text-center view-details',
		// 	accessor: (item) => {
		// 		return (
		// 			<div style={{ padding: '6px', cursor: 'pointer' }}>
		// 				{formatDate(item.createdAt)}
		// 			</div>
		// 		);
		// 	},
		// },

		{
			id: 4,
			Header: 'Delivery date time',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer' }}>
						{formatDate(item.delivery_datetime)}<br/>{formatTime(item.delivery_datetime)}
					</div>
				);
			},
		},

		// {
		// 	id: 6,
		// 	Header: 'Delivery time',
		// 	width: 100,
		// 	className: 'text-center view-details',
		// 	accessor: (item) => {
		// 		return (
		// 			<div style={{ padding: '6px', cursor: 'pointer' }}>
		// 				{formatTime(item.delivery_datetime)}
		// 			</div>
		// 		);
		// 	},
		// },
		{
			id: 5,
			Header: 'Number Of Orders',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer' }}>
						{item.order_count}
					</div>
				);
			},
		},
		{
			id: 6,
			Header: 'Total Order amount',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer' }}>
						${item.amount}
					</div>
				);
			},
		},
		{
			id: 7,
			Header: 'Restaurant Fee',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer' }}>
						${item.restaurant_fee}
					</div>
				);
			},
		},
		{
			id: 8,
			Header: 'Mode',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div style={{ padding: '6px', cursor: 'pointer', color:item.type==0?"red":item.type==1?"green":"#eec600" }}>
						{item.type==0?"-":item.type==1?"Online":"Offline"}
					</div>
				);
			},
		},
		{
			id: 9,
			Header: 'Order Email',
			width: 100,
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div 
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems:"center"
					}}>

					
						<div>
							<button
								style={{ height: '3rem', width:"5rem" }}
								onClick={() => handleSendOrderEmail(item)}
								className='shadow bg-white-500 hover:bg-white-400 focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded'
								type='button'
								disabled={item.email_count > 1?true:false}>
								{item.email_count < 1 ? 'Send' :item.email_count < 2? 'Resend':"Done"}
							</button>
						</div>
						<div style={{marginLeft:"5px"}}>
						{item.email_count}
						</div>
					</div>
				);
			},
		},
		{
			id: 10,
			Header: 'Action',
			className: 'text-center view-details',
			accessor: (item) => {
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
						}}
						className='text-center'
						onClick={(e) => {item.status == 0 ? history.push({pathname:`/restaurantPayment/resturantPayNow`, state:item}) : e.stopPropagation()}}>
						<button
							style={{ height: '3rem' }}
							// onClick={() => history.push('/addBanner')}
							className='shadow bg-white-500 hover:bg-white-400 focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded'
							type='button'>
							{item.status == 0 ? 'Pay Now' : 'Settled'}
						</button>
					</div>
				);
			},
		},
	];

	useEffect(()=>{
		let data={
			body:{
				datetime:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
			}
		}

		generateRestaurantEarnings(token,data)
		.then((res)=>{
			console.log("Restaurant Payment Generated:",res)
			restaurantEarningList();
		})

	},[])

	useEffect(() => {

		restaurantEarningList();
	}, [activePage]);

	useEffect(() => {
		dispatch(clearSearchAndFilter);
		dispatch(clearData(handleSearch));
	  }, []);

	const restaurantEarningList = async () => {
		try {
			setLoading(true);
			let data={
				query:{
					start_date:startDate.trim()!=""?moment(startDate,"MM/DD/YYYY").format("YYYY-MM-DD"):startDate,
				    end_date:endDate.trim()!=""?moment(endDate,"MM/DD/YYYY").format("YYYY-MM-DD"):endDate,
					filter_key:filterby,
					current_date:moment(new Date()).format("YYYY-MM-DD"),
					page:activePage,
					page_size:pageSize
				}
			}
			if(searchText && searchText.trim()!=""){
				data.query.search_key=searchText;
			}
			let res = await getRestaurantEarningList(
				token,
				// searchText,
				// startDate,
				// endDate,
				// filterby,
				// activePage,
				// pageSize
				data,
			);

			if (res.success) {
				setTotalItems(res.count);
				setRestaurantPayment(res.rows);
				let newStartId = pageSize * (activePage - 1);
				setStartId(newStartId);
				setLoading(false);
				setError(null);
			}
		} catch (error) {
			setError(error);
			setTotalItems(0);
			setLoading(false);
			setRestaurantPayment([]);
		}
	};
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleSearch = () => {
		restaurantEarningList();
	};

	const handleSendOrderEmail=(item)=>{
		setLoading(true);
		let data={
			body:{
				payment_id:item.payment_id,
			}
		}
		generateRestaurantOrderEmail(token,data)
		.then((res)=>{
			setLoading(false);
			restaurantEarningList();
		})
		.catch((error)=>{
			setError(error);
			setLoading(false);
		})
	}


	return (
		<>
			<div className='main-content md:pb-5 flex-1 p-8 px-2' style={{ overflowY: 'auto', height: '100vh' }}>
				<div id='recipients' className='p-4 md:p-8 mt-6 lg:mt-0 rounded shadow bg-white'>
					<h1 className='text-xl'>Restaurant Payment Management</h1>
				<SearchComponent
					{...{
						placeholder: 'Payment id, Restaurant name',
						handleSearch,
						clearSearchAndFilter,
					}}
				/>

					{error && (
						<p
							style={{
								color: 'red',
								fontSize: '20px',
								textAlign: 'center',
								width: '100%',
							}}>
							{error}
						</p>
					)}
					<ReactTable
						showPagination={false}
						minRows={0}
						NoDataComponent={() => null}
						defaultPageSize={10}
						data={restaurantPayment}
						className='-highlight'
						columns={columns}
						loading={loading}
						style={{marginTop:20}}
					/>
					<br />
					{totalItems > 0 ? `(showing ${startId + 1} - ${endId} of ${totalItems})` : 'showing 0 result'}
					<div style={{ textAlign: 'right' }}>
						<Pagination
							activePage={activePage}
							itemsCountPerPage={pageSize}
							totalItemsCount={totalItems}
							pageRangeDisplayed={3}
							onChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default RestaurantPayment;
