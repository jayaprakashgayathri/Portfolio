from flask import Flask, render_template, abort

app = Flask(__name__, static_folder='public', static_url_path='')

PROJECTS = {
    "poster-series": {
        "title": "Event poster series",
        "category": "Poster design",
        "year": "2025",
        "tagline": "A set of posters exploring contrast and type as image.",
        "hero_placeholder": "PLACEHOLDER: poster-series-hero.jpg",
        "problem": "Replace with the brief / constraint for this project.",
        "approach": "Replace with the key decision you made and why.",
        "result": "Replace with the outcome / what changed.",
    },
    "feedforward": {
        "title": "FeedForward",
        "category": "ML / research",
        "year": "2025",
        "tagline": "A research project on feedforward model behavior.",
        "hero_placeholder": "PLACEHOLDER: feedforward-hero.jpg",
        "problem": "Replace with the brief / constraint for this project.",
        "approach": "Replace with the key decision you made and why.",
        "result": "Replace with the outcome / what changed.",
    },
    "uiux-redesign": {
        "title": "App redesign case study",
        "category": "UI / UX",
        "year": "2024",
        "tagline": "A redesign focused on reducing user drop-off.",
        "hero_placeholder": "PLACEHOLDER: uiux-redesign-hero.jpg",
        "problem": "Replace with the brief / constraint for this project.",
        "approach": "Replace with the key decision you made and why.",
        "result": "Replace with the outcome / what changed.",
    },
    "data-dashboard": {
        "title": "Dashboard & insights",
        "category": "Data analytics",
        "year": "2024",
        "tagline": "An analytics dashboard surfacing key trends.",
        "hero_placeholder": "PLACEHOLDER: data-dashboard-hero.jpg",
        "problem": "Replace with the brief / constraint for this project.",
        "approach": "Replace with the key decision you made and why.",
        "result": "Replace with the outcome / what changed.",
    },
}


@app.route("/")
def index():
    return render_template("index.html", projects=PROJECTS)


@app.route("/work")
def work():
    return render_template("work.html", projects=PROJECTS)


@app.route("/project/<slug>")
def project(slug):
    data = PROJECTS.get(slug)
    if not data:
        abort(404)
    slugs = list(PROJECTS.keys())
    next_slug = slugs[(slugs.index(slug) + 1) % len(slugs)]
    return render_template(
        "project.html", slug=slug, p=data, next_slug=next_slug,
        next_title=PROJECTS[next_slug]["title"]
    )


if __name__ == "__main__":
    app.run(debug=True)
