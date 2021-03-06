window.addEventListener( 'load', async () => {

	const baseRepo = `https://github.com/sergej-kucharev/cn-2020`;
	const baseSite = `https://sergej-kucharev.github.io/cn-2020`;
	let groups = [
		'group-ka71.json',
		'group-ka72.json',
		'group-ka73.json',
		'group-ka74.json',
		'group-ka77.json',
	];


	const append = ( parent ) => ( child ) => {
		if ( child instanceof Object ) {
			parent.appendChild( child );
		} else {
			parent.textContent = child;
		}
	};
	const $ = ( tag, { attr, classList, parent, content, } ) => {
		const result = document.createElement( tag );

		if ( attr instanceof Object ) {
			for ( const [ key, value ] of Object.entries( attr ) ) {
				result.setAttribute( key, value );
			}
		}

		if ( classList instanceof Array ) {
			result.classList.add( ...classList );
		}

		if ( content instanceof Array ) {
			content.forEach( append( result ) );
		} else {
			append( result )( content );
		}

		if ( parent ) {
			parent.appendChild( result );
		}

		return result;
	};


	groups = groups.map( async ( groupFile ) => {
		try {
			const response = await fetch( 
				`${ baseSite }/${ groupFile }`,
				// {
				// 	method: 'GET',
				// 	cache: 'no-cache',
				// 	credentials: 'same-origin', // include, *same-origin, omit
				// 	redirect: 'follow', // manual, *follow, error
				// 	referrerPolicy: 'no-referrer', // no-referrer, *client
				// }
			);
			return await response.json();
		} catch ( error ) {
			console.log( error );
			return false;
		}
	} );
	groups = await Promise.all( groups );


	groups = groups.filter( group => group );
	groups = groups.map( ( groupData ) => {
		const { class: className, group, title: titleName, students, } = groupData;

		return $( "section", {
			classList: [ "group", className ],
			content: [
				$( "h2", {
					content: [
						titleName,
						$( "a", {
							attr: {
								"href": `${ baseRepo }/tree/master/${ group }/`,
								"target": "_blank",
							},
							classList: [ "group__link" ],
						} ),

					], } ),
				...students.map( studentName => $( 'div', {
					classList: [ "group__student" ],
					content: [
						$( "h3", { content: [
							studentName,
							$( "a", {
								attr: {
									"href": `${ baseRepo }/tree/master/${ group }/${ studentName }/`,
									"target": "_blank",
								},
								classList: [ "group__link" ],
							} ),
						], } ),
						$( "ol", { content: [
							...[ "lab1", "lab2", "lab3", "lab4", "lab5" ].map( labName => $( "li", {
								content: [
									labName,
									$( "a", {
										attr: {
											"href": `${ baseRepo }/tree/master/${ group }/${ studentName }/${ labName }`,
											"target": "_blank",
										},
										classList: [ "group__link" ],
									} ),
								],
							} ) ),
						] } ),
					],
				} ) ),
			],
		} );
	} );

	const main = document.getElementById( 'main' );
	for ( const group of groups ) {
		main.appendChild( group );
	}

} );
