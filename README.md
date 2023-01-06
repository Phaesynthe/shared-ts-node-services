# Shared TS-Node Services

A collection of logic services shared between projects.

## Usage

**Huge Note** This is not intended to be installed in a consumer using the standard pattern.

The reasoning for this is that, although this repo is intended to be shared, it is not intended for wider utilization
and thus does not require any build steps. In fact, a build would add to the day-to-day complexity without adding any
value at all.

This repo is intended to be leveraged as a git submodule.

**Advantages**:
- Modifications can be made in place next to the consumer with little effort
- Docker build commands like `COPY . .` pick up this project when installed as advised
  - This allows the repo to be `private` WITHOUT needing to add SSH to your docker container

**Drawbacks**:
- Non-Standard package install pattern
- Several copies of the package results in a potential to lose track of changes.

### Installing

```bash
mkdir sub_modules
cd sub_modules
git submodule add [Repo URL]
cd ..
npm i "./sub_modules/[Repo Name]" --save
```

## License
This project and all of its contents is not licensed for any purpose whatsoever.
