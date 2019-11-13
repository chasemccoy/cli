import {useReducer, useEffect} from 'react'

const reducer = (state, newState) => ({
	...state,
	...newState
})

const useForm = (onSubmit, initialState) => {
	const [formData, setFormData] = useReducer(reducer, initialState)

	useEffect(() => {
		if (formData.step === 'submit') {
			onSubmit(formData)
		}
	}, [formData, onSubmit])

	return [formData, setFormData]
}

export default useForm
