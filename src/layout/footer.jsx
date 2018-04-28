import '../assets/styles/footer.styl';

export default{
	data(){
		return {
			author:'CP'
		}
	},
	render(){
		return (
			<div id="footer">
				<span>Written with {this.author}</span>
			</div>
		)
	}
}
