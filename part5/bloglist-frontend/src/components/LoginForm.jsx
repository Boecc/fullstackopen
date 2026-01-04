const LoginForm = ({
	handleSubmit,
	handleUserNameChange,
	handlePasswordChange,
	username,
	password
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<div>
				username
				<input
					value={username}
					onChange={handleUserNameChange}
				/>
			</div>
			<div>
				password
				<input
					type="password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	)
}

export default LoginForm